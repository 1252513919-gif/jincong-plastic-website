import { requireLeadDevApiSession, unauthorizedJson } from "./auth";

export async function withLeadDevApi<T>(handler: () => Promise<T>) {
  const session = await requireLeadDevApiSession();
  if (!session) return unauthorizedJson();
  return handler();
}

export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export function jsonOk<T>(data: T) {
  return Response.json({ success: true, ...data });
}
