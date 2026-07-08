import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

type ContactPayload = {
  language?: "zh" | "en";
  name?: string;
  company?: string;
  country?: string;
  phone?: string;
  wechat?: string;
  email?: string;
  product?: string;
  category?: string;
  quantity?: string;
  material?: string;
  drawing?: string;
  message?: string;
  sourcePage?: string;
};

const fields: Array<[keyof ContactPayload, string, string]> = [
  ["name", "姓名", "Name"],
  ["company", "公司", "Company"],
  ["country", "国家/地区", "Country"],
  ["phone", "电话 / WhatsApp", "Phone / WhatsApp"],
  ["wechat", "微信", "WeChat"],
  ["email", "邮箱", "Email"],
  ["product", "产品需求", "Product Requirement"],
  ["category", "产品类型", "Product Type"],
  ["material", "材料", "Material"],
  ["quantity", "数量", "Quantity"],
  ["drawing", "是否有图纸/样品", "Drawing or Sample Available"],
  ["message", "留言内容", "Message"],
  ["sourcePage", "来源页面 URL", "Source Page URL"]
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function handleContactRequest(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const name = clean(payload.name);
  const phone = clean(payload.phone);
  const wechat = clean(payload.wechat);
  const email = clean(payload.email);
  const message = clean(payload.message);

  if (!name || (!phone && !wechat) || !message) {
    return NextResponse.json(
      { success: false, error: "Name, phone or WeChat, and message are required" },
      { status: 400 }
    );
  }

  if (email && !emailPattern.test(email)) {
    return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || "true").toLowerCase() !== "false";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.MAIL_TO || process.env.INQUIRY_RECEIVER_EMAIL || site.inquiryReceiverEmail;

  if (!host || !user || !pass || !receiver) {
    return NextResponse.json({ success: false, error: "SMTP is not configured" }, { status: 503 });
  }

  const submittedAt = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const subject = payload.language === "en"
    ? "New Inquiry from Jincong Plastic Website"
    : "锦聪橡塑官网新询盘";

  const normalizedPayload: ContactPayload = {
    ...payload,
    name,
    phone,
    wechat,
    email,
    message,
    sourcePage: clean(payload.sourcePage)
  };

  const rows = fields
    .map(([key, zhLabel, enLabel]) => {
      const label = `${zhLabel} / ${enLabel}`;
      return `<tr>
        <td style="width:220px;padding:10px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border:1px solid #e2e8f0;">${escapeHtml(clean(normalizedPayload[key]) || "-")}</td>
      </tr>`;
    })
    .join("");

  const text = [
    subject,
    "",
    ...fields.map(([key, zhLabel, enLabel]) => `${zhLabel} / ${enLabel}: ${clean(normalizedPayload[key]) || "-"}`),
    `提交时间 / Submission Time: ${submittedAt}`
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  try {
    await transporter.sendMail({
      from: `"Jincong Plastic Website" <${user}>`,
      to: receiver,
      replyTo: email || undefined,
      subject,
      text,
      html: `
        <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#0f172a;line-height:1.6;">
          <h2 style="margin:0 0 16px;">${escapeHtml(subject)}</h2>
          <p style="margin:0 0 16px;color:#475569;">A customer submitted a new inquiry from Jincong Plastic website.</p>
          <table style="border-collapse:collapse;width:100%;max-width:820px;">${rows}
            <tr>
              <td style="width:220px;padding:10px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;">提交时间 / Submission Time</td>
              <td style="padding:10px 12px;border:1px solid #e2e8f0;">${escapeHtml(submittedAt)}</td>
            </tr>
          </table>
        </div>
      `
    });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Failed to send email";
    console.error("Contact email send failed:", messageText);
    return NextResponse.json({ success: false, error: messageText }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
