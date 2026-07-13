import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "pg";

type Row = Record<string, unknown>;

const dryRun = process.argv.includes("--dry-run");
const sourcePath = resolve(process.env.SQLITE_DB_PATH || "prisma/dev.db");
const postgresUrl = process.env.POSTGRES_DATABASE_URL || "";
const idConflictClause = 'ON CONFLICT ("id") DO UPDATE';
const idempotencyConflictClause = 'ON CONFLICT ("idempotencyKey") DO UPDATE';
const leadFieldsPreservedForFollowUp = ["followUpAt", "followUpMethod", "followUpStatus", "followUpNote"];

function assertPostgresUrl(value: string) {
  if (!value.startsWith("postgresql://") && !value.startsWith("postgres://")) {
    throw new Error("POSTGRES_DATABASE_URL must be a PostgreSQL connection string.");
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

function readTable(db: DatabaseSync, table: string) {
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

async function main() {
  if (!existsSync(sourcePath)) throw new Error("SQLite source database was not found.");
  const db = new DatabaseSync(sourcePath);
  const data = {
    Lead: readTable(db, "Lead"),
    EmailDraft: readTable(db, "EmailDraft"),
    EmailLog: readTable(db, "EmailLog"),
    SuppressionList: readTable(db, "SuppressionList"),
    SystemSetting: readTable(db, "SystemSetting")
  };
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
