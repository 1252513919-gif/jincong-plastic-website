import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = resolve("prisma", databaseUrl.replace(/^file:/, ""));
mkdirSync(dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyName" TEXT NOT NULL,
  "region" TEXT,
  "industry" TEXT,
  "website" TEXT,
  "publicEmail" TEXT,
  "publicPhone" TEXT,
  "contactPerson" TEXT,
  "sourceUrl" TEXT,
  "priority" TEXT DEFAULT 'MEDIUM',
  "productCategory" TEXT,
  "productSummary" TEXT,
  "potentialPlasticParts" TEXT,
  "personalizationReason" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "contactVerifiedAt" DATETIME,
  "contactVerificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
  "contactSourceUrl" TEXT,
  "lastResearchAt" DATETIME,
  "websiteSnapshot" TEXT,
  "lastContactedAt" DATETIME,
  "repliedAt" DATETIME,
  "hasFollowedUp" BOOLEAN NOT NULL DEFAULT false,
  "doNotContactReason" TEXT,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "EmailDraft" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "leadId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "version" INTEGER NOT NULL DEFAULT 1,
  "idempotencyKey" TEXT NOT NULL,
  "approvedAt" DATETIME,
  "sentAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailDraft_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "EmailLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "leadId" TEXT NOT NULL,
  "draftId" TEXT,
  "type" TEXT NOT NULL,
  "intendedRecipient" TEXT NOT NULL,
  "actualRecipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "testMode" BOOLEAN NOT NULL,
  "smtpUser" TEXT,
  "errorMessage" TEXT,
  "idempotencyKey" TEXT NOT NULL,
  "sentAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EmailLog_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "EmailDraft" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "SuppressionList" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "sourceLeadId" TEXT,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "SystemSetting" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'lead-dev',
  "testMode" BOOLEAN NOT NULL DEFAULT true,
  "paused" BOOLEAN NOT NULL DEFAULT false,
  "stopAllSending" BOOLEAN NOT NULL DEFAULT false,
  "dailySendLimit" INTEGER NOT NULL DEFAULT 8,
  "minSendIntervalMinutes" INTEGER NOT NULL DEFAULT 3,
  "maxSendIntervalMinutes" INTEGER NOT NULL DEFAULT 8,
  "sendWindowStart" TEXT NOT NULL DEFAULT '09:00',
  "sendWindowEnd" TEXT NOT NULL DEFAULT '17:30',
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Shanghai',
  "lastSentAt" DATETIME,
  "nextAllowedSendAt" DATETIME,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Lead_companyName_idx" ON "Lead"("companyName");
CREATE INDEX IF NOT EXISTS "Lead_publicEmail_idx" ON "Lead"("publicEmail");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "Lead_contactVerificationStatus_idx" ON "Lead"("contactVerificationStatus");
CREATE UNIQUE INDEX IF NOT EXISTS "EmailDraft_idempotencyKey_key" ON "EmailDraft"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "EmailDraft_leadId_idx" ON "EmailDraft"("leadId");
CREATE INDEX IF NOT EXISTS "EmailDraft_status_idx" ON "EmailDraft"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "EmailDraft_leadId_type_version_key" ON "EmailDraft"("leadId", "type", "version");
CREATE UNIQUE INDEX IF NOT EXISTS "EmailLog_idempotencyKey_key" ON "EmailLog"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "EmailLog_leadId_idx" ON "EmailLog"("leadId");
CREATE INDEX IF NOT EXISTS "EmailLog_draftId_idx" ON "EmailLog"("draftId");
CREATE INDEX IF NOT EXISTS "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");
CREATE INDEX IF NOT EXISTS "SuppressionList_value_idx" ON "SuppressionList"("value");
CREATE UNIQUE INDEX IF NOT EXISTS "SuppressionList_type_value_key" ON "SuppressionList"("type", "value");
`);

db.prepare(`INSERT OR IGNORE INTO "SystemSetting" ("id", "testMode", "updatedAt") VALUES ('lead-dev', true, CURRENT_TIMESTAMP)`).run();

const leads = [
  ["河北恒驰自行车零件集团有限公司", "河北邢台", "童车/自行车零件", "童车、儿童自行车及相关零部件"],
  ["河北贝儿佳儿童用品有限公司", "河北邢台", "儿童用品", "儿童车、婴童用品及塑料配件"],
  ["河北红思达车业有限公司", "河北邢台", "车业", "童车、自行车及车用配件"],
  ["河北库比车业有限公司", "河北邢台", "车业", "儿童车、滑步车及车架配件"],
  ["河北盛马电子科技有限公司", "河北", "电子电气", "电子电气产品、外壳及固定配件"],
  ["河北蓝鸟家具股份有限公司", "河北邢台", "家具", "办公家具、家具结构件及配套五金塑料件"],
  ["荣喜宠物食品有限公司", "河北", "宠物用品", "宠物食品及宠物用品配套件"],
  ["邢台诺德宠物用品有限公司", "河北邢台", "宠物用品", "宠物用品、宠物出行及喂养相关产品"],
  ["河北酷贝宠物用品有限公司", "河北", "宠物用品", "宠物用品及相关塑料结构件"],
  ["清河县利国汽车配件有限公司", "河北邢台", "汽车配件", "汽车配件、卡扣、堵盖及橡塑配件"]
];

const insertLead = db.prepare(`
INSERT OR IGNORE INTO "Lead"
("id", "companyName", "region", "industry", "productSummary", "priority", "contactVerificationStatus", "notes", "updatedAt")
VALUES (?, ?, ?, ?, ?, 'MEDIUM', 'UNVERIFIED', '首批内置客户。发送前必须重新访问官网或公开来源验证联系方式。', CURRENT_TIMESTAMP)
`);

for (const lead of leads) {
  insertLead.run(lead[0], lead[0], lead[1], lead[2], lead[3]);
}

db.close();
console.log(`Lead development SQLite database initialized at ${dbPath}`);
