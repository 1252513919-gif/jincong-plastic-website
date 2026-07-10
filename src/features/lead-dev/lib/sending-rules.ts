import { getEmailDomain, isValidEmail } from "./email-validation";

export type ContactVerificationStatus = "UNVERIFIED" | "VERIFIED" | "INVALID" | "STALE";

export type ApprovalInput = {
  recipient: string;
  contactVerificationStatus: ContactVerificationStatus;
  contactSourceUrl?: string | null;
  suppressed: boolean;
};

export function canApproveDraft(input: ApprovalInput): { ok: boolean; reason?: string } {
  if (!isValidEmail(input.recipient)) return { ok: false, reason: "邮箱格式不正确" };
  if (input.contactVerificationStatus !== "VERIFIED") return { ok: false, reason: "联系人邮箱必须是 VERIFIED" };
  if (!input.contactSourceUrl?.trim()) return { ok: false, reason: "必须填写联系方式来源 URL" };
  if (input.suppressed) return { ok: false, reason: "该邮箱或域名在拒绝联系名单中" };
  return { ok: true };
}

export function isWithinSendingWindow(date: Date, timeZone = "Asia/Shanghai") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  const total = hour * 60 + minute;
  return !["Sat", "Sun"].includes(weekday ?? "") && total >= 9 * 60 && total <= 17 * 60 + 30;
}

export function isSuppressedEmail(email: string, suppressedValues: string[]) {
  const normalized = email.trim().toLowerCase();
  const domain = getEmailDomain(normalized);
  return suppressedValues.some((value) => {
    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue === normalized || normalizedValue === domain;
  });
}

export function addWorkingDays(start: Date, workingDays: number) {
  const date = new Date(start);
  let remaining = workingDays;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date;
}
