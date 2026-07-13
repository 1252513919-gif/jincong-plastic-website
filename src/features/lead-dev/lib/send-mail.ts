import nodemailer from "nodemailer";

export type LeadDevMailInput = {
  intendedRecipient: string;
  subject: string;
  body: string;
};

export type LeadDevMailConfigInput = {
  testMode: boolean;
  testRecipient?: string;
  smtpHost?: string;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail?: string;
};

export function validateLeadDevMailConfig(input: LeadDevMailConfigInput): { ok: boolean; reason?: string } {
  if (input.testMode) {
    if (!input.testRecipient?.trim()) return { ok: false, reason: "TEST_RECIPIENT is not configured" };
    if (isPlaceholderTestRecipient(input.testRecipient)) return { ok: false, reason: "TEST_RECIPIENT is still a placeholder" };
  }
  if (!input.smtpHost?.trim() || !input.smtpUser?.trim() || !input.smtpPass?.trim() || !input.fromEmail?.trim()) {
    return { ok: false, reason: "SMTP is not configured" };
  }
  if (isPlaceholderSmtpPass(input.smtpPass)) return { ok: false, reason: "SMTP_PASS is still a placeholder" };
  return { ok: true };
}

export async function sendLeadDevMail(input: LeadDevMailInput) {
  const testMode = process.env.TEST_MODE !== "false";
  const actualRecipient = testMode ? process.env.TEST_RECIPIENT : input.intendedRecipient;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || user;
  const config = validateLeadDevMailConfig({
    testMode,
    testRecipient: process.env.TEST_RECIPIENT,
    smtpHost: host,
    smtpUser: user,
    smtpPass: pass,
    fromEmail
  });
  if (!config.ok) throw new Error(config.reason);

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true").toLowerCase() !== "false",
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || "邢台锦聪橡塑有限公司"}" <${fromEmail}>`,
    to: actualRecipient,
    subject: input.subject,
    text: input.body
  });

  return {
    testMode,
    intendedRecipient: input.intendedRecipient,
    actualRecipient: actualRecipient as string,
    smtpUser: user
  };
}

function isPlaceholderTestRecipient(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized === "test@example.com" || normalized.endsWith("@example.com") || normalized.endsWith("@example.test");
}

function isPlaceholderSmtpPass(value: string | undefined) {
  const normalized = value?.trim();
  return !normalized || normalized === "腾讯企业邮箱客户端专用密码" || normalized.toLowerCase().includes("placeholder");
}
