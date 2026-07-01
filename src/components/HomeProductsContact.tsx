import Link from "next/link";
import { ArrowRight, Car, CircleDot, Mail, MessageCircle, MonitorCog, PawPrint, Phone, Sofa, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

const series = [
  { icon: PawPrint, title: "宠物用品系列", text: "宠物饮水器配件、喂食器配件、塑料连接件等。", className: "lg:col-span-2" },
  { icon: MonitorCog, title: "电子电气塑料件系列", text: "塑料外壳、线夹、线扣、保护盖、固定座等。", className: "" },
  { icon: Sofa, title: "家具塑料配件系列", text: "家具脚垫、堵盖、调节脚、连接件等。", className: "" },
  { icon: CircleDot, title: "平垫系列", text: "尼龙平垫、塑料平垫、绝缘垫片、定制垫圈等。", className: "" },
  { icon: Car, title: "汽车塑料件系列", text: "汽车卡扣、塑料堵盖、支架、垫片、内外饰小件等。", className: "lg:col-span-2" }
];

const industries = ["汽车配套", "电子电器", "仪器仪表壳体", "家具配件", "平垫/垫片", "宠物用品"];

export function HomeProductsContact() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8fb] py-20 lg:py-28">
      <div className="absolute right-[-10rem] top-0 h-[28rem] w-[28rem] rounded-full bg-sky-100 blur-3xl" />
      <div className="absolute left-[-8rem] bottom-10 h-[24rem] w-[24rem] rounded-full bg-orange-100/70 blur-3xl" />
      <div className="section-shell relative z-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">Product Series</p>
              <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                五大产品方向，覆盖常用塑料配件与行业结构件
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                产品方向覆盖日常塑料配件、结构件、垫片和行业配套件，可按材料、颜色、尺寸、数量和包装要求配合生产。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-sky-700">
                查看产品中心
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50">
                提交定制需求
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {series.map(({ icon: Icon, title, text, className }, index) => (
            <Reveal
              key={title}
              delay={index * 0.05}
              className={`group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-2 hover:border-sky-200 hover:shadow-[0_28px_90px_rgba(15,23,42,0.1)] ${className}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-sky-700 transition group-hover:bg-sky-50">
                  <Icon className="h-6 w-6" />
                </span>
                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600" />
              </div>
              <h3 className="mt-7 text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] lg:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
              <Wrench className="h-6 w-6" />
            </span>
            <h3 className="mt-6 text-2xl font-semibold text-slate-950">行业应用</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              面向汽配、电子电器、家具、宠物用品和机械连接等场景，提供常用塑料配件和非标结构件加工配合。
            </p>
          </Reveal>
          <Reveal className="grid gap-3 sm:grid-cols-3">
            {industries.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-sky-200">
                {item}
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.1)] lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="eyebrow">Contact</p>
              <h3 className="mt-4 text-3xl font-semibold text-slate-950">把图纸、样品或采购需求发给我们</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                发送图纸、样品照片、尺寸、材料或数量要求，我们会结合加工方式和订单批量沟通报价。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700">
                  联系我们
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:border-sky-300 hover:bg-sky-50">
                  查看产品系列
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {site.phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:bg-sky-50">
                  <Phone className="h-4 w-4 text-sky-600" />
                  {phone}
                </a>
              ))}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900">
                <MessageCircle className="h-4 w-4 text-sky-600" />
                微信：{site.wechat}
              </div>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:bg-sky-50 md:col-span-2">
                <Mail className="h-4 w-4 text-sky-600" />
                {site.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
