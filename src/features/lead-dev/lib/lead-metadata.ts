import type { LeadStatus } from "@prisma/client";

export const leadSourceTypes = ["地图", "官网", "1688", "爱采购", "展会", "园区名录", "协会", "其他"] as const;
export const leadContactStatuses = ["待联系", "已联系", "已回复", "有意向", "暂无需求", "拒绝联系"] as const;
export const leadMatchLevels = ["高", "中", "低", "待评估"] as const;

export type LeadSourceType = (typeof leadSourceTypes)[number];
export type LeadContactStatus = (typeof leadContactStatuses)[number];
export type LeadMatchLevel = (typeof leadMatchLevels)[number];

export type LeadMetadata = {
  sourceType?: string;
  wechat?: string;
  contactStatus?: string;
};

const metaPattern = /<!--lead-dev-meta:([\s\S]*?)-->/;

export function parseLeadNotes(notes?: string | null): { visibleNotes: string; metadata: LeadMetadata } {
  if (!notes) return { visibleNotes: "", metadata: {} };
  const match = notes.match(metaPattern);
  if (!match) return { visibleNotes: notes.trim(), metadata: {} };

  let metadata: LeadMetadata = {};
  try {
    const parsed = JSON.parse(match[1]) as LeadMetadata;
    metadata = {
      sourceType: cleanMetaValue(parsed.sourceType),
      wechat: cleanMetaValue(parsed.wechat),
      contactStatus: cleanMetaValue(parsed.contactStatus)
    };
  } catch {
    metadata = {};
  }

  return { visibleNotes: notes.replace(metaPattern, "").trim(), metadata };
}

export function buildLeadNotes(visibleNotes?: string | null, metadata: LeadMetadata = {}) {
  const cleanMetadata: LeadMetadata = {};
  if (metadata.sourceType) cleanMetadata.sourceType = metadata.sourceType;
  if (metadata.wechat) cleanMetadata.wechat = metadata.wechat;
  if (metadata.contactStatus) cleanMetadata.contactStatus = metadata.contactStatus;

  const noteText = visibleNotes?.trim() || "";
  if (Object.keys(cleanMetadata).length === 0) return noteText || null;
  return `${noteText}${noteText ? "\n" : ""}<!--lead-dev-meta:${JSON.stringify(cleanMetadata)}-->`;
}

export function normalizeSourceType(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return "";
  return leadSourceTypes.includes(clean as LeadSourceType) ? clean : "其他";
}

export function normalizeContactStatus(value?: string | null) {
  const clean = value?.trim();
  if (!clean) return "";
  return leadContactStatuses.includes(clean as LeadContactStatus) ? clean : "";
}

export function normalizeMatchLevel(value?: string | null) {
  const clean = value?.trim().toUpperCase();
  if (!clean) return "";
  if (["HIGH", "高", "A"].includes(clean)) return "高";
  if (["MEDIUM", "中", "B"].includes(clean)) return "中";
  if (["LOW", "低", "C"].includes(clean)) return "低";
  return "待评估";
}

export function priorityFromMatchLevel(value?: string | null) {
  const clean = normalizeMatchLevel(value);
  if (clean === "高") return "HIGH";
  if (clean === "低") return "LOW";
  if (clean === "待评估") return "PENDING";
  return "MEDIUM";
}

export function matchLevelFromPriority(value?: string | null) {
  const clean = value?.trim().toUpperCase();
  if (clean === "HIGH") return "高";
  if (clean === "LOW") return "低";
  if (clean === "PENDING") return "待评估";
  return "中";
}

export function statusFromContactStatus(value?: string | null): LeadStatus {
  switch (normalizeContactStatus(value)) {
    case "已联系":
      return "CONTACTED";
    case "已回复":
      return "REPLIED";
    case "有意向":
      return "RESEARCHED";
    case "暂无需求":
      return "REJECTED";
    case "拒绝联系":
      return "DO_NOT_CONTACT";
    default:
      return "NEW";
  }
}

export function deriveContactStatus(status: LeadStatus | string, metadataStatus?: string | null) {
  const fromMeta = normalizeContactStatus(metadataStatus);
  if (fromMeta) return fromMeta;
  switch (status) {
    case "CONTACTED":
      return "已联系";
    case "REPLIED":
      return "已回复";
    case "RESEARCHED":
      return "有意向";
    case "REJECTED":
      return "暂无需求";
    case "DO_NOT_CONTACT":
      return "拒绝联系";
    default:
      return "待联系";
  }
}

function cleanMetaValue(value?: string | null) {
  const clean = value?.trim();
  return clean || undefined;
}
