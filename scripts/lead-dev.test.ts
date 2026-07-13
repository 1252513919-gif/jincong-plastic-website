import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { createSessionCookie, hashPassword, sessionCookieOptions, verifyPassword, verifySessionCookie } from "../src/features/lead-dev/lib/auth";
import { parseLeadCsvPreview, sanitizeCsvCell } from "../src/features/lead-dev/lib/csv";
import { generateFirstTouchDraft } from "../src/features/lead-dev/lib/draft-generator";
import { isValidEmail, normalizeEmail } from "../src/features/lead-dev/lib/email-validation";
import { canApproveDraft, isWithinSendingWindow } from "../src/features/lead-dev/lib/sending-rules";
import { validateLeadDevMailConfig } from "../src/features/lead-dev/lib/send-mail";
import { validatePublicResearchUrl } from "../src/features/lead-dev/lib/ssrf";

test("validates and normalizes email addresses", () => {
  assert.equal(isValidEmail("sales@example.com"), true);
  assert.equal(isValidEmail("bad@@example.com"), false);
  assert.equal(normalizeEmail(" Sales@Example.COM "), "sales@example.com");
});

test("sanitizes CSV cells that could become spreadsheet formulas", () => {
  assert.equal(sanitizeCsvCell("=cmd|A1"), "'=cmd|A1");
  assert.equal(sanitizeCsvCell("+SUM(A1:A2)"), "'+SUM(A1:A2)");
  assert.equal(sanitizeCsvCell("普通文本"), "普通文本");
});

test("previews CSV import without creating drafts or sends", () => {
  const csv = [
    "companyName,region,industry,website,publicEmail,publicPhone,contactPerson,sourceUrl,priority,productCategory,notes",
    "测试公司,邢台,电子,http://example.com,sales@example.com,123,,http://example.com,MEDIUM,电子件,=risk",
    "缺名公司,,,,,,,,,,"
  ].join("\n");

  const preview = parseLeadCsvPreview(csv);
  assert.equal(preview.validRows.length, 2);
  assert.equal(preview.validRows[0].notes, "'=risk");
  assert.equal(preview.errors.length, 0);
});

test("rejects CSV with unexpected columns", () => {
  const csv = "companyName,badColumn\n测试公司,value";
  const preview = parseLeadCsvPreview(csv);
  assert.equal(preview.validRows.length, 0);
  assert.match(preview.errors[0].message, /列名/);
});

test("draft generation is conservative, Chinese, reviewed, and free of placeholders", () => {
  const draft = generateFirstTouchDraft({
    companyName: "锦聪客户开发系统验收测试",
    productSummary: "塑料零部件及注塑加工相关业务测试",
    potentialPlasticParts: ["塑料外壳", "结构件", "连接件"],
    website: "https://www.jincongplastic.com"
  });

  const chineseChars = Array.from(draft.body).filter((char) => /\p{Script=Han}/u.test(char)).length;
  assert.match(draft.subject, /注塑|塑料|合作/);
  assert.doesNotMatch(draft.body, /测试|验收|系统/);
  assert.match(draft.body, /来图来样/);
  assert.match(draft.body, /小批量试产/);
  assert.match(draft.body, /OEM\/ODM/);
  assert.match(draft.body, /模具配套/);
  assert.match(draft.body, /无需联系/);
  assert.doesNotMatch(draft.body, /\{\{|undefined|null|\[联系人姓名\]/);
  assert.equal(chineseChars >= 180 && chineseChars <= 300, true);
});

test("first touch template uses a concise non-test subject and formal signature", () => {
  const draft = generateFirstTouchDraft({
    companyName: "\u9526\u806a\u5ba2\u6237\u5f00\u53d1\u7cfb\u7edf\u9a8c\u6536\u6d4b\u8bd5",
    contactPerson: null,
    industry: "\u6ce8\u5851\u52a0\u5de5\u6d4b\u8bd5",
    productSummary: "\u5851\u6599\u96f6\u90e8\u4ef6\u53ca\u6ce8\u5851\u52a0\u5de5\u76f8\u5173\u4e1a\u52a1\u6d4b\u8bd5",
    potentialPlasticParts: ["\u5851\u6599\u5916\u58f3", "\u7ed3\u6784\u4ef6", "\u8fde\u63a5\u4ef6"],
    website: "https://www.jincongplastic.com"
  });

  assert.equal(draft.subject.includes("\u6d4b\u8bd5"), false);
  assert.equal(Array.from(draft.subject).length <= 30, true);
  assert.match(draft.subject, /\u5851\u6599\u96f6\u90e8\u4ef6\u6ce8\u5851\u52a0\u5de5\u5408\u4f5c\u54a8\u8be2/);
  assert.match(draft.body, /^\u60a8\u597d/);
  assert.equal(draft.body.includes("\u6d4b\u8bd5"), false);
  assert.doesNotMatch(draft.body, /\{\{|undefined|null|\[[^\]]+\]/);
  assert.match(draft.body, /\u6765\u56fe\u6765\u6837\u52a0\u5de5/);
  assert.match(draft.body, /\u6ce8\u5851\u4ef6\u5b9a\u5236/);
  assert.match(draft.body, /\u5c0f\u6279\u91cf\u8bd5\u4ea7/);
  assert.match(draft.body, /OEM\/ODM/);
  assert.match(draft.body, /\u6a21\u5177\u914d\u5957/);
  assert.match(draft.body, /\u8fde\u6d69\u7487/);
  assert.match(draft.body, /\u90a2\u53f0\u9526\u806a\u6a61\u5851\u6709\u9650\u516c\u53f8/);
  assert.match(draft.body, /lianhaoxuan@jincongrp\.cn/);
  assert.match(draft.body, /https:\/\/www\.jincongplastic\.com/);
  const chineseChars = Array.from(draft.body).filter((char) => /\p{Script=Han}/u.test(char)).length;
  assert.equal(chineseChars >= 200 && chineseChars <= 350, true);
});

test("generic plastic processing industries use the default concise subject", () => {
  const draft = generateFirstTouchDraft({
    companyName: "\u9526\u806a\u90ae\u4ef6\u6a21\u677f\u6700\u7ec8\u9a8c\u6536",
    contactPerson: null,
    industry: "\u5851\u6599\u96f6\u90e8\u4ef6\u52a0\u5de5",
    productSummary: "\u5851\u6599\u96f6\u90e8\u4ef6\u52a0\u5de5\u4e0e\u6ce8\u5851\u4ef6\u5b9a\u5236",
    potentialPlasticParts: "\u5851\u6599\u5916\u58f3\u3001\u7ed3\u6784\u4ef6\u3001\u8fde\u63a5\u4ef6",
    website: "https://www.jincongplastic.com"
  });

  assert.equal(draft.subject, "\u5851\u6599\u96f6\u90e8\u4ef6\u6ce8\u5851\u52a0\u5de5\u5408\u4f5c\u54a8\u8be2");
  assert.equal(draft.body.includes("\u5982\u4e0d\u5e0c\u671b\u7ee7\u7eed\u6536\u5230\u90ae\u4ef6\uff0c\u53ef\u56de\u590d\u65e0\u9700\u8054\u7cfb"), true);
  assert.doesNotMatch(draft.body, /\u660e\u786e\u91c7\u8d2d\u8ba1\u5212|\u6b63\u5728\u5bfb\u627e\u4f9b\u5e94\u5546/);
});

test("approval requires verified contact", () => {
  const result = canApproveDraft({
    recipient: "sales@example.com",
    contactVerificationStatus: "UNVERIFIED",
    contactSourceUrl: "https://example.com/contact",
    suppressed: false
  });

  assert.equal(result.ok, false);
  assert.match(result.reason ?? "", /VERIFIED/);
});

test("approval accepts verified non-suppressed contact", () => {
  const result = canApproveDraft({
    recipient: "sales@example.com",
    contactVerificationStatus: "VERIFIED",
    contactSourceUrl: "https://example.com/contact",
    suppressed: false
  });

  assert.equal(result.ok, true);
});

test("sending window allows weekday business time only", () => {
  assert.equal(isWithinSendingWindow(new Date("2026-07-10T02:00:00.000Z")), true);
  assert.equal(isWithinSendingWindow(new Date("2026-07-11T02:00:00.000Z")), false);
  assert.equal(isWithinSendingWindow(new Date("2026-07-10T11:00:00.000Z")), false);
});

test("SSRF guard rejects unsafe URLs", async () => {
  await assert.rejects(() => validatePublicResearchUrl("file:///etc/passwd"), /协议/);
  await assert.rejects(() => validatePublicResearchUrl("http://localhost"), /不允许/);
  await assert.rejects(() => validatePublicResearchUrl("http://127.0.0.1"), /不允许/);
});

test("SSRF guard accepts normal public http URL syntax", async () => {
  const url = await validatePublicResearchUrl("https://www.example.com/path");
  assert.equal(url.hostname, "www.example.com");
});

test("admin password hash verifies correct password and rejects wrong password", async () => {
  const hash = hashPassword("safe-password-123");
  assert.equal(await verifyPassword("safe-password-123", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});

test("session cookie uses root path and is not secure in local development", () => {
  const options = sessionCookieOptions();
  assert.equal(options.path, "/");
  assert.equal(options.httpOnly, true);
  assert.equal(options.sameSite, "lax");
  assert.equal(options.secure, false);
});

test("session cookie can be verified by shared auth logic", async () => {
  const originalSecret = process.env.LEAD_DEV_SESSION_SECRET;
  process.env.LEAD_DEV_SESSION_SECRET = "test-session-secret-long-enough-for-login";
  const cookie = await createSessionCookie("admin");
  const session = verifySessionCookie(cookie);
  assert.equal(session?.username, "admin");
  process.env.LEAD_DEV_SESSION_SECRET = originalSecret;
});

test("login form is protected against default GET credential leaks", () => {
  const source = readFileSync("src/features/lead-dev/components/LeadDevLoginForm.tsx", "utf8");
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /method="post"/);
  assert.match(source, /action="\/api\/lead-dev\/auth\/login"/);
  assert.doesNotMatch(source, /method="get"/i);
  assert.match(source, /router\.replace\(\"\/lead-dev\"\)/);
  assert.match(source, /router\.refresh\(\)/);
});

test("lead list links use stable lead ids under the protected detail route", () => {
  const source = readFileSync("src/app/lead-dev/leads/page.tsx", "utf8");
  assert.match(source, /href=\{`\/lead-dev\/leads\/\$\{lead\.id\}`\}/);
  assert.doesNotMatch(source, /href=\{`\/lead-dev\/leads\/\$\{lead\.companyName\}`\}/);
});

test("seeded local leads use route-safe ids instead of company names", () => {
  const db = new DatabaseSync("prisma/dev.db");
  const leads = db.prepare("select id, companyName from Lead order by createdAt asc").all() as Array<{ id: string; companyName: string }>;
  db.close();
  assert.equal(leads.length >= 10, true);
  const seeded = leads.slice(0, 10);
  assert.equal(seeded.every((lead) => lead.id && lead.id !== lead.companyName), true);
  assert.equal(seeded.every((lead) => /^lead-[a-z0-9-]+$/.test(lead.id)), true);
});

test("lead detail page renders a backend not-found state instead of default 404", () => {
  const source = readFileSync("src/app/lead-dev/leads/[id]/page.tsx", "utf8");
  assert.doesNotMatch(source, /notFound\(/);
  assert.match(source, /未找到该客户/);
  assert.match(source, /href="\/lead-dev\/leads"/);
});

test("lead detail page displays core lead, research, draft, and follow-up sections", () => {
  const source = readFileSync("src/app/lead-dev/leads/[id]/page.tsx", "utf8");
  for (const text of ["企业名称", "行业", "地区", "官网", "联系人", "邮箱", "电话", "客户来源", "生命周期状态", "联系方式验证状态", "客户研究信息", "开发信草稿记录", "跟进记录"]) {
    assert.match(source, new RegExp(text));
  }
});

test("generated lead drafts enter pending review and never auto-approve", () => {
  const source = readFileSync("src/app/api/lead-dev/leads/[id]/drafts/route.ts", "utf8");
  assert.match(source, /status:\s*"PENDING_REVIEW"/);
  assert.doesNotMatch(source, /status:\s*"APPROVED"/);
});

test("sent leads can carry a three-working-day follow-up task visible in detail and follow-up center", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  const detail = readFileSync("src/app/lead-dev/leads/[id]/page.tsx", "utf8");
  const followUps = readFileSync("src/app/lead-dev/follow-ups/page.tsx", "utf8");

  assert.match(schema, /followUpAt\s+DateTime\?/);
  assert.match(schema, /followUpMethod\s+String\?/);
  assert.match(schema, /followUpStatus\s+String\?/);
  assert.match(schema, /followUpNote\s+String\?/);
  assert.match(detail, /followUpAt/);
  assert.match(detail, /\u8ddf\u8fdb\u4efb\u52a1/);
  assert.match(followUps, /followUpAt/);
  assert.match(followUps, /\u5f85\u8ddf\u8fdb/);
});

test("queue page shows pending review drafts with review controls and safe test mode copy", () => {
  const source = [
    readFileSync("src/app/lead-dev/queue/page.tsx", "utf8"),
    readFileSync("src/features/lead-dev/components/QueueActions.tsx", "utf8")
  ].join("\n");
  assert.match(source, /PENDING_REVIEW/);
  assert.match(source, /邮件正文/);
  assert.match(source, /审核通过/);
  assert.match(source, /拒绝草稿/);
  assert.match(source, /发送下一封已批准邮件/);
  assert.match(source, /TEST_MODE=true/);
});

test("mail configuration blocks placeholder test recipient and SMTP password", () => {
  const valid = validateLeadDevMailConfig({
    testMode: true,
    testRecipient: "safe-test@jincongplastic.test",
    smtpHost: "smtp.example.test",
    smtpUser: "mailer@example.test",
    smtpPass: "configured-secret",
    fromEmail: "mailer@example.test"
  });
  assert.equal(valid.ok, true);

  const placeholderRecipient = validateLeadDevMailConfig({
    testMode: true,
    testRecipient: "test@example.com",
    smtpHost: "smtp.example.test",
    smtpUser: "mailer@example.test",
    smtpPass: "configured-secret",
    fromEmail: "mailer@example.test"
  });
  assert.equal(placeholderRecipient.ok, false);
  assert.match(placeholderRecipient.reason ?? "", /TEST_RECIPIENT/);

  const placeholderPass = validateLeadDevMailConfig({
    testMode: true,
    testRecipient: "safe-test@jincongplastic.test",
    smtpHost: "smtp.example.test",
    smtpUser: "mailer@example.test",
    smtpPass: "腾讯企业邮箱客户端专用密码",
    fromEmail: "mailer@example.test"
  });
  assert.equal(placeholderPass.ok, false);
  assert.match(placeholderPass.reason ?? "", /SMTP_PASS/);
});

test("test mode duplicate protection is draft-specific because all tests use TEST_RECIPIENT", () => {
  const source = readFileSync("src/app/api/lead-dev/queue/send-next/route.ts", "utf8");
  assert.match(source, /testModeEnabled/);
  assert.match(source, /draftId:\s*draft\.id/);
  assert.match(source, /intendedRecipient:\s*draft\.recipient/);
});

test("production postgres schema is prepared without replacing local sqlite schema", () => {
  const localSchema = readFileSync("prisma/schema.prisma", "utf8");
  const postgresSchema = readFileSync("prisma/schema.postgres.prisma", "utf8");

  assert.match(localSchema, /provider\s+=\s+"sqlite"/);
  assert.match(postgresSchema, /provider\s+=\s+"postgresql"/);
  assert.match(postgresSchema, /followUpAt\s+DateTime\?/);
  assert.match(postgresSchema, /@@unique\(\[leadId, type, version\]\)/);
  assert.match(postgresSchema, /idempotencyKey\s+String\s+@unique/);
});

test("sqlite to postgres migration script preserves ids and prevents duplicate imports", () => {
  const source = readFileSync("scripts/migrate-lead-dev-sqlite-to-postgres.ts", "utf8");

  assert.match(source, /POSTGRES_DATABASE_URL/);
  assert.match(source, /ON CONFLICT \("id"\) DO UPDATE/);
  assert.match(source, /ON CONFLICT \("idempotencyKey"\) DO UPDATE/);
  assert.match(source, /assertPostgresUrl/);
  assert.match(source, /followUpAt/);
});

test("production environment example stays safe and keeps TEST_MODE true", () => {
  const source = readFileSync(".env.example", "utf8");

  for (const key of [
    "DATABASE_URL",
    "TEST_MODE=true",
    "TEST_RECIPIENT=",
    "SMTP_HOST=",
    "SMTP_PORT=",
    "SMTP_SECURE=",
    "SMTP_USER=",
    "SMTP_PASS=",
    "FROM_NAME=",
    "FROM_EMAIL=",
    "COMPANY_WEBSITE=",
    "LEAD_DEV_ADMIN_USERNAME=",
    "LEAD_DEV_ADMIN_PASSWORD_HASH=",
    "LEAD_DEV_SESSION_SECRET="
  ]) {
    assert.match(source, new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(source, /admin123456/);
});

test("lead dev health route exposes no secrets", () => {
  const source = readFileSync("src/app/api/lead-dev/health/route.ts", "utf8");

  assert.match(source, /runtime = "nodejs"/);
  assert.match(source, /TEST_MODE/);
  assert.doesNotMatch(source, /SMTP_PASS|LEAD_DEV_SESSION_SECRET|DATABASE_URL|password/i);
});

test("login api has server-side rate limiting and does not log credentials", () => {
  const source = readFileSync("src/app/api/lead-dev/auth/login/route.ts", "utf8");

  assert.match(source, /checkLoginRateLimit/);
  assert.match(source, /recordFailedLogin/);
  assert.doesNotMatch(source, /console\.(log|error|warn)\([^)]*password/i);
});
