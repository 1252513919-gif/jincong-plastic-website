import { prisma } from "@/features/lead-dev/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const setting = await prisma.systemSetting.upsert({
    where: { id: "lead-dev" },
    update: {},
    create: { id: "lead-dev", testMode: true }
  });

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500">系统设置</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">只读运行状态</h1>
        <p className="mt-1 text-sm text-slate-500">这里只展示安全状态和发送规则，不显示任何密码、密钥或数据库连接信息。</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SettingCard label="TEST_MODE" value={setting.testMode ? "true" : "false"} tone={setting.testMode ? "green" : "red"} />
        <SettingCard label="每日发送额度" value={`${setting.dailySendLimit} 封`} />
        <SettingCard label="发送窗口" value={`${setting.sendWindowStart} - ${setting.sendWindowEnd}`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">只读配置状态</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ReadonlyRow label="发送暂停" value={setting.paused ? "已暂停" : "未暂停"} />
          <ReadonlyRow label="停止全部发送" value={setting.stopAllSending ? "已启用" : "未启用"} />
          <ReadonlyRow label="发送间隔" value={`${setting.minSendIntervalMinutes}-${setting.maxSendIntervalMinutes} 分钟`} />
          <ReadonlyRow label="时区" value={setting.timezone} />
          <ReadonlyRow label="测试收件人" value="服务端环境变量托管，页面不显示具体值" />
          <ReadonlyRow label="邮件服务" value="服务端环境变量托管，页面不显示密钥" />
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
        TEST_MODE 为 true 时，系统发送接口会把最终收件人限制为测试收件人；真实客户邮件发送能力仍受服务端规则控制。
      </div>
    </section>
  );
}

function SettingCard({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "green" | "red" }) {
  const valueClass = {
    slate: "text-slate-950",
    green: "text-emerald-700",
    red: "text-red-700"
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function ReadonlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
