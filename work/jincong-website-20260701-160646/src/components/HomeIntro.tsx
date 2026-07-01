import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  PackageCheck,
  Phone,
  Settings2,
  Sparkles,
  Wrench
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

const stats = [
  { value: "5+", label: "核心产品系列", labelEn: "Core Product Series" },
  { value: "180+", label: "产品展示", labelEn: "Products" }
];

const capabilities = [
  { icon: Settings2, title: "来图来样定制", text: "可根据图纸、样品、尺寸、材料和颜色要求进行加工。" },
  { icon: Sparkles, title: "小批量试产", text: "适合新品验证、结构确认和中小批量订单。" },
  { icon: Wrench, title: "OEM 加工", text: "支持按客户品牌、规格、包装和交付节奏配合生产。" }
];

const productSeries = [
  "宠物用品系列",
  "电子电气塑料件系列",
  "家具塑料配件系列",
  "塑料平垫 / 垫片系列",
  "汽车塑料件系列"
];

const materials = ["ABS", "PP", "PE", "POM", "PVC", "PC"];

export function HomeIntro() {
  return (
    <section id="home-intro" className="scroll-mt-24 bg-graphite-950 py-20 lg:py-28">
      <div className="section-shell">
        <Reveal>
          <p className="eyebrow">Factory Introduction</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                注塑加工和塑料件定制，适合中小批量订单的工厂配合方式
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-steel-300 sm:text-lg">
                锦聪橡塑专注于注塑加工与塑料件定制服务，可根据客户图纸、样品、尺寸、材料和颜色要求进行加工。我们目前重点覆盖宠物用品系列、电子电气塑料件系列、家具塑料配件系列、平垫系列和汽车塑料件系列，适合中小批量订单、小批量试产和常用塑料配件定制需求。相比复杂的大型供应链流程，我们更重视直接沟通、快速响应和灵活配合。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-lg p-6 transition hover:-translate-y-1 hover:border-electric-400/45">
                  <div className="text-4xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-2 text-sm font-semibold text-steel-300">{stat.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-steel-500">{stat.labelEn}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.06} className="rounded-lg border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-electric-400/45">
              <Icon className="h-7 w-7 text-electric-400" />
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-steel-300">{text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="glass-panel rounded-lg p-6 lg:p-8">
            <PackageCheck className="h-8 w-8 text-electric-400" />
            <h3 className="mt-5 text-2xl font-semibold text-white">主要产品系列</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {productSeries.map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-steel-300 transition hover:border-electric-400/45 hover:text-white">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {materials.map((material) => (
                <span key={material} className="rounded-full border border-electric-400/25 bg-electric-400/10 px-3 py-1.5 text-xs font-semibold text-electric-400">
                  {material}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="rounded-lg border border-white/10 bg-white/[0.045] p-6 lg:p-8">
            <h3 className="text-2xl font-semibold text-white">联系方式</h3>
            <p className="mt-3 text-sm leading-7 text-steel-300">
              可直接发送图纸、样品照片、尺寸或用途说明，我们会根据材料、数量和加工要求沟通报价。
            </p>
            <div className="mt-6 grid gap-3 text-sm text-steel-300">
              {site.phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-electric-400/45 hover:text-white">
                  <Phone className="h-4 w-4 text-electric-400" />
                  {phone}
                </a>
              ))}
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3">
                <MessageCircle className="h-4 w-4 text-electric-400" />
                微信：{site.wechat}
              </div>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-electric-400/45 hover:text-white">
                <Mail className="h-4 w-4 text-electric-400" />
                {site.email}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12 rounded-lg border border-electric-400/25 bg-electric-400/10 p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <h3 className="text-2xl font-semibold text-white">需要定制塑料件或试产样品？</h3>
            <p className="mt-3 text-sm leading-7 text-steel-300">可以先从产品系列了解加工方向，也可以直接提交图纸和数量需求。</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8">
              查看产品中心
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-graphite-950 transition hover:bg-electric-400">
              提交定制需求
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
