import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type InquiryPayload = {
  language?: "zh" | "en";
  name?: string;
  company?: string;
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

const fields: Array<[keyof InquiryPayload, string, string]> = [
  ["name", "姓名", "Name"],
  ["company", "公司名称", "Company"],
  ["phone", "电话", "Phone"],
  ["wechat", "微信", "WeChat"],
  ["email", "邮箱", "Email"],
  ["category", "产品类型", "Product Type"],
  ["material", "材料", "Material"],
  ["quantity", "数量", "Quantity"],
  ["drawing", "是否有图纸/样品", "Drawing or Sample Available"],
  ["message", "需求描述", "Requirement Details"],
  ["sourcePage", "来源页面", "Source Page"]
];

export async function POST(request: Request) {
  let payload: InquiryPayload;

  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if ((!payload.phone?.trim() && !payload.wechat?.trim()) || !payload.message?.trim()) {
    return NextResponse.json({ message: "Phone or WeChat and requirement details are required" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.INQUIRY_RECEIVER_EMAIL || site.inquiryReceiverEmail;

  if (!host || !user || !pass || !receiver) {
    return NextResponse.json({ message: "SMTP is not configured" }, { status: 503 });
  }

  const isEn = payload.language === "en";
  const submittedAt = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const subject = isEn
    ? "[Website Inquiry] Custom Plastic Parts Requirement Submitted"
    : "【网站询盘】客户提交了塑料件定制需求";

  const rows = fields
    .map(([key, zhLabel, enLabel]) => {
      const label = `${zhLabel} / ${enLabel}`;
      return `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(payload[key] || "-")}</td></tr>`;
    })
    .join("");

  const text = [
    subject,
    "",
    ...fields.map(([key, zhLabel, enLabel]) => `${zhLabel} / ${enLabel}: ${payload[key] || "-"}`),
    `提交时间 / Submission Time: ${submittedAt}`
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: `"锦聪官网询盘" <${user}>`,
    to: receiver,
    replyTo: payload.email || undefined,
    subject,
    text,
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#0f172a;">
        <h2>${escapeHtml(subject)}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:760px;">${rows}
          <tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">提交时间 / Submission Time</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(submittedAt)}</td></tr>
        </table>
      </div>
    `
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
