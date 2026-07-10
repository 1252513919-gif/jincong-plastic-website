import test from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, normalizeEmail } from "../src/features/lead-dev/lib/email-validation";
import { parseLeadCsvPreview, sanitizeCsvCell } from "../src/features/lead-dev/lib/csv";
import { generateFirstTouchDraft } from "../src/features/lead-dev/lib/draft-generator";
import { canApproveDraft, isWithinSendingWindow } from "../src/features/lead-dev/lib/sending-rules";
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

test("draft generation includes personalization and opt-out text", () => {
  const draft = generateFirstTouchDraft({
    companyName: "河北测试制造有限公司",
    productSummary: "童车和儿童自行车",
    potentialPlasticParts: ["塑料卡扣", "堵盖", "护套"],
    website: "https://www.jincongplastic.com"
  });

  assert.match(draft.subject, /合作|注塑|塑料/);
  assert.match(draft.body, /河北测试制造有限公司/);
  assert.match(draft.body, /童车和儿童自行车/);
  assert.match(draft.body, /塑料卡扣/);
  assert.match(draft.body, /无需联系/);
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
