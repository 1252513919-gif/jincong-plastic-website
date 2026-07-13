import crypto from "node:crypto";

export type DraftInput = {
  companyName: string;
  contactPerson?: string | null;
  industry?: string | null;
  productSummary?: string | null;
  potentialPlasticParts?: string[] | string | null;
  website?: string | null;
};

export type DraftOutput = {
  subject: string;
  body: string;
  personalizationReason: string;
  idempotencyKey: string;
};

const defaultWebsite = "https://www.jincongplastic.com";
const defaultSubject = "塑料零部件注塑加工合作咨询";

export function generateFirstTouchDraft(input: DraftInput): DraftOutput {
  const business = cleanBusinessText(input.productSummary || input.industry || "公开资料中展示的主营业务");
  const parts = normalizeParts(input.potentialPlasticParts);
  const partText = parts.slice(0, 3).join("、");
  const website = input.website || process.env.COMPANY_WEBSITE || defaultWebsite;
  const greeting = buildGreeting(input.contactPerson);
  const subject = buildSubject(input.industry);
  const businessLine =
    business === "公开资料中展示的主营业务"
      ? "看到贵司公开资料中展示了相关主营业务，我们想先做一次简短的加工能力对接。"
      : `看到贵司公开资料中涉及${business}，我们想先做一次简短的加工能力对接。`;

  const body = [
    `${greeting}`,
    "",
    `${businessLine}我们是邢台锦聪橡塑有限公司，主要承接来图来样加工、注塑件定制、小批量试产、OEM/ODM及模具配套。`,
    "",
    `如后续有${partText}等塑料零部件外协、新品打样、补充供应商或结构优化需求，可以把产品图片、图纸、材料要求和预计数量发给我们，我们会先协助评估加工方案和报价。以上仅为能力介绍和沟通建议，不预设贵司已有采购需求。`,
    "",
    "如您不是相关负责人，也烦请转交采购、生产或产品研发同事。如不希望继续收到邮件，可回复无需联系。",
    "",
    "连浩璇",
    "邢台锦聪橡塑有限公司",
    "",
    "邮箱：lianhaoxuan@jincongrp.cn",
    `官网：${website}`
  ].join("\n");

  return {
    subject,
    body,
    personalizationReason: `根据公开主营方向“${business}”匹配可能涉及的塑料件：${partText}`,
    idempotencyKey: crypto.createHash("sha256").update(`${input.companyName}|${subject}|${body}`).digest("hex")
  };
}

export function inferPlasticParts(summary: string | null | undefined) {
  const text = String(summary ?? "");
  if (/童车|自行车|车业|滑步车/.test(text)) return ["塑料卡扣", "堵盖", "护套"];
  if (/电子|电气|电源|仪器|通讯/.test(text)) return ["塑料外壳", "线夹", "保护盖"];
  if (/家具|桌|椅|柜/.test(text)) return ["家具脚垫", "堵头", "调节脚"];
  if (/宠物|喂食|饮水|牵引/.test(text)) return ["塑料连接件", "喂养用品配件", "结构件"];
  if (/汽车|汽配|卡扣/.test(text)) return ["汽车卡扣", "塑料堵盖", "垫片"];
  return ["塑料外壳", "结构件", "连接件", "垫片"];
}

function buildSubject(industry: string | null | undefined) {
  if (/测试|验收|系统/.test(String(industry ?? ""))) return defaultSubject;
  const cleaned = cleanBusinessText(industry || "");
  if (!cleaned || cleaned === "公开资料中展示的主营业务") return defaultSubject;
  if (/塑料|注塑|加工|零部件|定制/.test(cleaned)) return defaultSubject;
  const candidate = `${cleaned.replace(/行业|业务/g, "")}塑料件加工咨询`;
  return candidate.includes("测试") || Array.from(candidate).length > 30 ? defaultSubject : candidate;
}

function buildGreeting(contactPerson: string | null | undefined) {
  const contact = cleanContact(contactPerson);
  return contact ? `${contact}，您好：` : "您好：";
}

function cleanContact(contactPerson: string | null | undefined) {
  const value = String(contactPerson ?? "").trim();
  if (!value || /测试|系统|负责人|undefined|null|\{\{|\[/.test(value)) return "";
  return value.slice(0, 20);
}

function cleanBusinessText(value: string) {
  const cleaned = value
    .replace(/测试|验收|系统|相关业务/g, "")
    .replace(/undefined|null|\{\{[^}]+\}\}|\[[^\]]+\]/g, "")
    .replace(/\s+/g, "")
    .replace(/[。；;，,]+$/g, "")
    .trim();
  return cleaned || "公开资料中展示的主营业务";
}

function normalizeParts(parts: DraftInput["potentialPlasticParts"]) {
  const values = Array.isArray(parts)
    ? parts
    : typeof parts === "string" && parts.trim()
      ? parts.split(/[、，,\n]/)
      : ["塑料外壳", "结构件", "连接件", "垫片"];

  const cleaned = values.map((item) => cleanBusinessText(String(item))).filter((item) => item !== "公开资料中展示的主营业务");
  return cleaned.length ? Array.from(new Set(cleaned)) : ["塑料外壳", "结构件", "连接件", "垫片"];
}
