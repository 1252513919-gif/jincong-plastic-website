import crypto from "node:crypto";

export type DraftInput = {
  companyName: string;
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

export function generateFirstTouchDraft(input: DraftInput): DraftOutput {
  const products = input.productSummary?.trim() || "公开资料中展示的相关产品";
  const parts = normalizeParts(input.potentialPlasticParts);
  const website = input.website || process.env.COMPANY_WEBSITE || "https://www.jincongplastic.com";
  const partText = parts.slice(0, 3).join("、");
  const subject = `关于贵司${products.slice(0, 14)}塑料配件外协加工的合作咨询`;
  const body = [
    `${input.companyName}相关负责人，您好：`,
    "",
    "我们是邢台锦聪橡塑有限公司，主要承接塑料件来图来样定制、注塑加工、小批量试产及批量生产。",
    "",
    `了解到贵司涉及${products}。结合相关产品结构，我们可以配合评估${partText}等零部件的打样和生产，也可在新品开发、订单高峰或现有供应商产能不足时提供本地外协支持。`,
    "",
    "如近期有塑料件开发、旧件改进、模具试产或外协生产需求，可以将产品图片、图纸、材料要求及预计数量发给我们，我们会先进行可制造性和报价评估。",
    "",
    `公司网站：${website}`,
    "",
    "如您不是相关负责人，也烦请协助转交采购、生产或产品研发部门。感谢您的时间。",
    "",
    "邢台锦聪橡塑有限公司",
    "",
    "如不希望再次收到相关合作邮件，回复“无需联系”即可，我们将停止后续发送。"
  ].join("\n");

  return {
    subject,
    body,
    personalizationReason: `根据公开产品信息“${products}”匹配可能需要的塑料件：${partText}`,
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
  return ["塑料卡扣", "塑料堵盖", "定制垫片"];
}

function normalizeParts(parts: DraftInput["potentialPlasticParts"]) {
  if (Array.isArray(parts)) return parts.filter(Boolean);
  if (typeof parts === "string" && parts.trim()) {
    return parts.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean);
  }
  return ["塑料卡扣", "塑料堵盖", "定制垫片"];
}
