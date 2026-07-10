const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string | null | undefined) {
  return String(email ?? "").trim().toLowerCase();
}

export function isValidEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email);
  return normalized.length <= 254 && emailPattern.test(normalized);
}

export function getEmailDomain(email: string | null | undefined) {
  const normalized = normalizeEmail(email);
  const at = normalized.lastIndexOf("@");
  return at > -1 ? normalized.slice(at + 1) : "";
}
