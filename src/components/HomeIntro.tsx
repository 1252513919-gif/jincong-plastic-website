import { Factory, FileText, Gauge, Layers3, Settings2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const stats = [
  { value: "5+", label: "核心产品系列", sub: "Core Product Series" },
  { value: "180+", label: "产品展示", sub: "Products" },
  { value: "OEM", label: "代工配合", sub: "OEM Processing" },
  { value: "小批量", label: "试产支持", sub: "Trial Production" }
];

const advantages = [
  { icon: Factory, title: "工厂直供", text: "从需求沟通到生产交付直接对接，减少中间环节，报价和响应更清晰。" },
  { icon: FileText, title: "来图来样定制", text: "可围绕图纸、样品、照片、尺寸、材质和颜色要求评估加工方案。" },
  { icon: Settings2, title: "材料覆盖", text: "常用 ABS、PP、PE、POM、PVC、PC 等材料，可按使用环境沟通选择。" },
  { icon: Gauge, title: "灵活试产", text: "适合新品验证、中小批量订单、非标配件和常用塑料件补充采购。" }
];

const process = ["需求沟通", "图纸/样品确认", "报价评估", "打样试产", "批量生产", "包装交付"];

export function HomeIntro() {
  return (
    <section id="home-intro" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="section-shell">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="eyebrow">Factory Positioning</p>
              <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                真实注塑加工工厂，适合中小批量塑料件定制需求
              </h2>
            </div>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              锦聪橡塑专注于注塑加工与塑料件定制服务，可根据客户图纸、样品、尺寸、材料和颜色要求进行加工。我们重点覆盖宠物用品系列、电子电气塑料件系列、家具塑料配件系列、平垫系列和汽车塑料件系列，适合中小批量订单、小批量试产和常用塑料配件定制需求。
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.05}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="text-4xl font-semibold text-slate-950">{stat.value}</div>
              <div className="mt-2 text-sm font-semibold text-slate-800">{stat.label}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{stat.sub}</div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-4">
          {advantages.map(({ icon: Icon, title, text }, index) => (
            <Reveal
              key={title}
              delay={index * 0.06}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1.5 hover:border-sky-200"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-slate-50 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                <Layers3 className="h-6 w-6 text-sky-700" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-950">加工流程清晰，方便快速推进</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                相比复杂的大型供应链流程，我们更重视直接沟通、快速响应和灵活配合，帮助客户更快判断材料、结构和生产方式。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {process.map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-sky-700">{String(index + 1).padStart(2, "0")}</div>
                  <div className="mt-3 text-sm font-semibold text-slate-950">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16 grid gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div>
            <p className="eyebrow">Manufacturing Scope</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">材料与产品范围可按项目沟通</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              可加工宠物用品、电子电气塑料件、家具塑料配件、塑料平垫、汽车塑料件等多类塑料产品。具体材料、颜色、表面要求和包装方式，可结合图纸或样品确认。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["ABS", "PP", "PE", "POM", "PVC", "PC"].map((material) => (
              <div key={material} className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center text-lg font-semibold text-slate-950 shadow-sm transition hover:-translate-y-1 hover:border-sky-200">
                {material}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
