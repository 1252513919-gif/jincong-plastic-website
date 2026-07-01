import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, FlaskConical, PackageCheck, PenTool, Settings2, Wrench } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "注塑定制服务 | 来图来样 小批量试产 OEM代工",
  description: "邢台锦聪橡塑有限公司提供塑料件注塑定制服务，支持来图来样加工、小批量试产、OEM代工、材料建议、试模试产和批量交付。",
  keywords: ["注塑定制", "来图来样加工", "小批量试产", "OEM代工", "塑料件定制"]
};

const steps = [
  { icon: ClipboardCheck, title: "需求确认", text: "确认产品用途、尺寸、公差、颜色、数量、交期和包装要求。" },
  { icon: PenTool, title: "图纸/样品评估", text: "根据图纸、样件或照片评估结构、材料和生产可行性。" },
  { icon: Settings2, title: "材料与工艺建议", text: "结合强度、耐磨、绝缘、耐候、外观等需求建议材料。" },
  { icon: Wrench, title: "模具与试产", text: "配合模具开发、试模、试产和样品确认，减少批量风险。" },
  { icon: FlaskConical, title: "质量确认", text: "围绕外观、尺寸、装配和批次一致性进行过程检查。" },
  { icon: PackageCheck, title: "批量交付", text: "按订单节奏生产、包装、发货，支持长期供货合作。" }
];

export default function CustomInjectionMoldingPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom Injection Molding"
        title="注塑定制服务"
        description="面向有图纸、有样品、有非标塑料件需求的客户，提供从前期评估、小批量试产到 OEM 批量代工的一体化制造配合。"
      >
        <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
          提交图纸或样品需求
          <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <Reveal>
            <p className="eyebrow">Process</p>
            <h2 className="section-title">清晰流程让定制更可控</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.05} className="glass-panel rounded-[1.5rem] p-6">
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50">
                    <Icon className="h-5 w-5 text-sky-700" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">OEM Capability</p>
            <h2 className="section-title">适合新品验证、配套采购与长期代工</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {["塑料平垫/垫片非标规格", "汽车塑料配套件", "电子电器结构件与外观件", "宠物用品塑料配件", "家具脚垫、管塞、连接件", "颜色、材料、包装定制"].map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-800">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
