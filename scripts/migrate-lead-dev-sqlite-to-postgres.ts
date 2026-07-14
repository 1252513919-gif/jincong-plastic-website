import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "pg";

type Row = Record<string, unknown>;

const dryRun = process.argv.includes("--dry-run");
const sourcePath = resolve(process.env.SQLITE_DB_PATH || "prisma/dev.db");
const postgresUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
const idConflictClause = 'ON CONFLICT ("id") DO UPDATE';
const idempotencyConflictClause = 'ON CONFLICT ("idempotencyKey") DO UPDATE';
const leadFieldsPreservedForFollowUp = ["followUpAt", "followUpMethod", "followUpStatus", "followUpNote"];
const followUpRecordConflictClause = 'ON CONFLICT ("id") DO UPDATE';

function assertPostgresUrl(value: string) {
  if (!value.startsWith("postgresql://") && !value.startsWith("postgres://")) {
    throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be a PostgreSQL connection string.");
  }
}

function normalizeBoolean(value: unknown) {
  if (value === 1 || value === "1" || value === true) return true;
  if (value === 0 || value === "0" || value === false) return false;
  return value;
}

function cleanRow(row: Row) {
  const next: Row = {};
  for (const [key, value] of Object.entries(row)) {
    next[key] = key === "hasFollowedUp" || key === "testMode" || key === "paused" || key === "stopAllSending" ? normalizeBoolean(value) : value;
  }
  return next;
}

function hasTable(db: DatabaseSync, table: string) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(table);
  return Boolean(row);
}

function readTable(db: DatabaseSync, table: string) {
  if (!hasTable(db, table)) return [];
  return db.prepare(`SELECT * FROM "${table}"`).all().map(cleanRow);
}

function placeholders(count: number, offset = 0) {
  return Array.from({ length: count }, (_, index) => `$${index + 1 + offset}`).join(", ");
}

async function upsertRows(client: Client, table: string, rows: Row[], conflictColumn = "id") {
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = keys.map((key) => row[key]);
    const quotedKeys = keys.map((key) => `"${key}"`);
    const updates = keys.filter((key) => key !== conflictColumn).map((key) => `"${key}" = EXCLUDED."${key}"`);
    await client.query(
      `INSERT INTO "${table}" (${quotedKeys.join(", ")}) VALUES (${placeholders(keys.length)}) ${conflictColumn === "id" ? idConflictClause : `ON CONFLICT ("${conflictColumn}") DO UPDATE`} SET ${updates.join(", ")}`,
      values
    );
  }
}

async function upsertEmailLogs(client: Client, rows: Row[]) {
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = keys.map((key) => row[key]);
    const quotedKeys = keys.map((key) => `"${key}"`);
    const updates = keys.filter((key) => key !== "idempotencyKey").map((key) => `"${key}" = EXCLUDED."${key}"`);
    await client.query(
      `INSERT INTO "EmailLog" (${quotedKeys.join(", ")}) VALUES (${placeholders(keys.length)}) ${idempotencyConflictClause} SET ${updates.join(", ")}`,
      values
    );
  }
}

async function upsertFollowUpRecords(client: Client, rows: Row[]) {
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = keys.map((key) => row[key]);
    const quotedKeys = keys.map((key) => `"${key}"`);
    const updates = keys.filter((key) => key !== "id").map((key) => `"${key}" = EXCLUDED."${key}"`);
    await client.query(
      `INSERT INTO "FollowUpRecord" (${quotedKeys.join(", ")}) VALUES (${placeholders(keys.length)}) ${followUpRecordConflictClause} SET ${updates.join(", ")}`,
      values
    );
  }
}

function normalizeFollowUpMethod(value: unknown) {
  const text = String(value || "").toUpperCase();
  if (["EMAIL", "PHONE", "WECHAT", "VISIT", "OTHER"].includes(text)) return text;
  if (String(value || "").includes("电话")) return "PHONE";
  if (String(value || "").includes("微信")) return "WECHAT";
  if (String(value || "").includes("拜访")) return "VISIT";
  return "EMAIL";
}

function normalizeFollowUpStatus(value: unknown) {
  const text = String(value || "").toUpperCase();
  if (["PLANNED", "COMPLETED", "CANCELLED"].includes(text)) return text;
  if (String(value || "").includes("完成")) return "COMPLETED";
  if (String(value || "").includes("取消")) return "CANCELLED";
  return "PLANNED";
}

function buildLegacyFollowUpRecords(leads: Row[], existingRows: Row[]) {
  const existingIds = new Set(existingRows.map((row) => String(row.id)));
  const existingLegacyLeadIds = new Set(
    existingRows
      .filter((row) => String(row.id).startsWith("legacy-follow-up-"))
      .map((row) => String(row.leadId))
  );
  const legacyRows: Row[] = [];
  for (const lead of leads) {
    const leadId = String(lead.id || "");
    if (!leadId || existingLegacyLeadIds.has(leadId)) continue;
    if (!lead.followUpAt && !lead.followUpNote && !lead.lastContactedAt) continue;
    const id = `legacy-follow-up-${leadId}`;
    if (existingIds.has(id)) continue;
    const status = normalizeFollowUpStatus(lead.followUpStatus);
    legacyRows.push({
      id,
      leadId,
      method: normalizeFollowUpMethod(lead.followUpMethod),
      status,
      scheduledAt: lead.followUpAt || null,
      completedAt: status === "COMPLETED" ? lead.lastContactedAt || null : null,
      note: lead.followUpNote || "从 Lead 当前跟进字段迁移生成的初始跟进记录。",
      nextAction: null,
      createdAt: lead.followUpAt || lead.lastContactedAt || lead.createdAt,
      updatedAt: lead.updatedAt || lead.createdAt
    });
  }
  return [...existingRows, ...legacyRows];
}

async function main() {
  if (!existsSync(sourcePath)) throw new Error("SQLite source database was not found.");
  const db = new DatabaseSync(sourcePath);
  const data = {
    Lead: readTable(db, "Lead"),
    EmailDraft: readTable(db, "EmailDraft"),
    EmailLog: readTable(db, "EmailLog"),
    FollowUpRecord: [] as Row[],
    SuppressionList: readTable(db, "SuppressionList"),
    SystemSetting: readTable(db, "SystemSetting")
  };
  data.FollowUpRecord = buildLegacyFollowUpRecords(data.Lead, readTable(db, "FollowUpRecord"));
  db.close();

  const counts = Object.fromEntries(Object.entries(data).map(([table, rows]) => [table, rows.length]));
  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, sourcePath, counts, preservedFields: leadFieldsPreservedForFollowUp }, null, 2));
    return;
  }

  assertPostgresUrl(postgresUrl);
  const client = new Client({ connectionString: postgresUrl });
  await client.connect();
  try {
    await client.query("BEGIN");
    await upsertRows(client, "Lead", data.Lead);
    await upsertRows(client, "EmailDraft", data.EmailDraft);
    await upsertEmailLogs(client, data.EmailLog);
    await upsertFollowUpRecords(client, data.FollowUpRecord);
    await upsertRows(client, "SuppressionList", data.SuppressionList);
    await upsertRows(client, "SystemSetting", data.SystemSetting);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }

  console.log(JSON.stringify({ dryRun: false, migrated: counts }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Migration failed.");
  process.exit(1);
});
