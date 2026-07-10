import nodemailer from "nodemailer";

export type LeadDevMailInput = {
  intendedRecipient: string;
  subject: string;
  body: string;
};

export async function sendLeadDevMail(input: LeadDevMailInput) {
  const testMode = process.env.TEST_MODE !== "false";
  const actualRecipient = testMode ? process.env.TEST_RECIPIENT : input.intendedRecipient;
  if (!actualRecipient) {
    throw new Error(testMode ? "TEST_RECIPIENT is not configured" : "Recipient is missing");
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || user;
  if (!host || !user || !pass || !fromEmail) {
    throw new Error("SMTP is not configured");
  }

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
    actualRecipient,
    smtpUser: user
  };
}
