import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LeadDevLoginForm } from "@/features/lead-dev/components/LeadDevLoginForm";
import { getLeadDevSession } from "@/features/lead-dev/lib/auth";

export const metadata: Metadata = {
  title: "客户开发后台登录",
  robots: { index: false, follow: false }
};

export default async function LeadDevLoginPage() {
  const session = await getLeadDevSession();
  if (session) {
    redirect("/lead-dev");
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-sky-700">Jincong Lead Dev</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">客户开发后台登录</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          本后台用于本地企业客户开发和邮件审核。未登录用户无法访问页面和接口。
        </p>
        <LeadDevLoginForm />
      </div>
    </section>
  );
}
