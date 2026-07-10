import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function POST(request: Request) {
  return withLeadDevApi(async () => {
    const payload = (await request.json().catch(() => null)) as { action?: string } | null;
    const setting = await prisma.systemSetting.upsert({
      where: { id: "lead-dev" },
      update: {},
      create: { id: "lead-dev", testMode: true }
    });
    if (payload?.action === "pause") {
      await prisma.systemSetting.update({ where: { id: setting.id }, data: { paused: true } });
    } else if (payload?.action === "resume") {
      await prisma.systemSetting.update({ where: { id: setting.id }, data: { paused: false } });
    } else if (payload?.action === "stopAll") {
      await prisma.systemSetting.update({ where: { id: setting.id }, data: { stopAllSending: true } });
    } else if (payload?.action === "clearStop") {
      await prisma.systemSetting.update({ where: { id: setting.id }, data: { stopAllSending: false } });
    } else {
      return jsonError("未知操作");
    }
    return Response.json({ success: true });
  });
}
