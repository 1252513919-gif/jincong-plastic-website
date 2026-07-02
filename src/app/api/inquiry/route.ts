import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type InquiryPayload = {
  name?: string;
  company?: string;
  contact?: string;
  email?: string;
  product?: string;
  category?: string;
  quantity?: string;
  material?: string;
  drawing?: string;
  message?: string;
  sourcePage?: string;
};

const fields: Array<[keyof InquiryPayload, string]> = [
  ["name", "客户姓名"],
  ["company", "公司名称"],
  ["contact", "联系方式"],
  ["email", "邮箱"],
  ["product", "产品需求"],
  ["category", "产品类别"],
  ["quantity", "预计数量"],
  ["material", "材料要求"],
  ["drawing", "图纸/样品情况"],
  ["message", "需求描述"],
  ["sourcePage", "来源页面"]
];

export async function POST(request: Request) {
  let payload: InquiryPayload;

  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!payload.contact?.trim() || !payload.product?.trim()) {
    return NextResponse.json({ message: "Contact and product requirement are required" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.INQUIRY_RECEIVER_EMAIL || site.inquiryReceiverEmail;

  if (!host || !user || !pass || !receiver) {
    return NextResponse.json({ message: "SMTP is not configured" }, { status: 503 });
  }

  const submittedAt = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const rows = fields
    .map(([key, label]) => `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">${label}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(payload[key] || "-")}</td></tr>`)
    .join("");

  const text = [
    "【官网询盘】来自邢台锦聪橡塑有限公司官网的新客户需求",
    "",
    ...fields.map(([key, label]) => `${label}: ${payload[key] || "-"}`),
    `提交时间: ${submittedAt}`
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
    subject: "【官网询盘】来自邢台锦聪橡塑有限公司官网的新客户需求",
    text,
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#0f172a;">
        <h2>【官网询盘】来自邢台锦聪橡塑有限公司官网的新客户需求</h2>
        <table style="border-collapse:collapse;width:100%;max-width:760px;">${rows}
          <tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;">提交时间</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${submittedAt}</td></tr>
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
