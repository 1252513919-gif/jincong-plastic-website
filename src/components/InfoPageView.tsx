"use client";

"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, Factory, Layers3, PackageCheck, PenTool, Settings2, Wrench } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";

type PageKind = "custom" | "industries" | "about" | "faq";

const processIcons = [ClipboardCheck, PenTool, Settings2, Wrench, CheckCircle2, Factory, PackageCheck];

const customProvideZh = ["产品图片或实物样品", "图纸或尺寸", "材料要求", "使用场景", "预计数量", "是否需要小批量试产", "颜色、包装或装配要求"];
const customProvideEn = ["Product photos or physical samples", "Drawings or dimensions", "Material requirements", "Application scenario", "Estimated quantity", "Small-batch trial needs", "Color, packaging or assembly requirements"];

const industriesZh = [
  { title: "宠物用品", products: "宠物推车配件、宠物箱配件、牵引用品塑料件、宠物用品结构件。", focus: "关注安全性、装配结构、清洁便利性和外观一致性。" },
  { title: "电子电气", products: "电源开关配件、接线盒、电池盒、线夹、端盖、保护盖、塑料固定座。", focus: "关注绝缘性、尺寸稳定性、阻燃需求和装配定位。" },
  { title: "家具配件", products: "脚垫、堵头、连接件、调节脚、保护套、塑料垫片。", focus: "关注耐磨、防滑、外观匹配和安装便利性。" },
  { title: "汽车零部件", products: "汽车卡扣、堵盖、垫片、支架、内饰塑料件、外饰塑料件、电气塑料件。", focus: "关注耐候、耐磨、卡接结构和批次稳定性。" },
  { title: "仪器仪表", products: "控制器外壳、仪表壳体、检测仪外壳、传感器外壳、温控器外壳。", focus: "关注外壳结构、装配精度、保护性和材料强度。" },
  { title: "其他定制塑料件", products: "按图纸、样品、装配需求或使用场景定制的塑料零部件。", focus: "关注产品结构、材料选择、数量区间和交付方式。" }
];

const industriesEn = [
  { title: "Pet Products", products: "Pet stroller parts, carrier parts, leash housings and structural plastic parts.", focus: "Safety, assembly structure, cleaning convenience and appearance consistency." },
  { title: "Electronics", products: "Switch fittings, junction boxes, battery boxes, wire clips, end caps, protective covers and fixing bases.", focus: "Insulation, dimensional stability, flame-retardant needs and positioning." },
  { title: "Furniture Fittings", products: "Glides, plugs, connectors, adjustable feet, protective caps and plastic washers.", focus: "Wear resistance, anti-slip needs, appearance matching and easy installation." },
  { title: "Automotive Components", products: "Clips, caps, washers, brackets, interior parts, exterior parts and electrical plastic parts.", focus: "Weather resistance, wear resistance, snap-fit structure and batch stability." },
  { title: "Instrumentation", products: "Controller housings, instrument enclosures, tester housings, sensor housings and thermostat housings.", focus: "Housing structure, assembly accuracy, protection and material strength." },
  { title: "Other Custom Parts", products: "Plastic parts customized by drawings, samples, assembly needs or application scenarios.", focus: "Part structure, material choice, quantity range and delivery approach." }
];

const faqZh = [
  ["你们支持来图加工吗？", "支持。客户可以提供 2D 图纸、3D 文件、产品图片、尺寸要求或实物样品，我们会根据产品结构和材料需求沟通加工方案。"],
  ["没有图纸，只有样品可以做吗？", "可以沟通。客户可以提供实物样品或清晰产品图片，我们会根据样品结构、尺寸和用途判断是否适合加工。"],
  ["可以小批量试产吗？", "可以。我们支持小批量试产，适合客户前期验证结构、尺寸、装配效果和市场反馈。"],
  ["报价需要提供哪些信息？", "建议提供产品图片或图纸、尺寸、材料、数量、颜色、用途、是否需要小批量试产以及是否有包装要求。"],
  ["注塑加工的起订量是多少？", "不同产品结构、材料和加工难度不同，起订量需要根据具体产品沟通确认。我们可以先根据客户需求评估小批量试产方案。"],
  ["产品可以定制颜色吗？", "可以。多数塑料件可以根据客户需求沟通颜色，但具体颜色需要结合材料、数量和生产条件确认。"],
  ["可以做 OEM/ODM 吗？", "可以。我们支持按客户图纸、样品或使用需求进行塑料件定制加工，也可以配合长期批量供货项目。"],
  ["生产周期一般多久？", "周期与产品结构、数量、材料、是否需要试样等因素有关。确认产品需求后，我们会根据实际情况沟通交期。"],
  ["产品图片上的款式都能直接买吗？", "网站产品图片主要用于展示加工类型和产品范围，具体规格、尺寸和材料可根据客户需求沟通定制。"],
  ["你们能开发模具吗？", "如产品需要新模具，可根据产品结构和需求沟通模具方案。若客户已有模具、图纸或样品，也可根据实际情况评估加工方式。"]
];

const faqEn = [
  ["Do you support manufacturing from drawings?", "Yes. Customers can provide 2D drawings, 3D files, product photos, dimensions or physical samples. We will review the structure and material needs before discussing a manufacturing approach."],
  ["Can you work from samples without drawings?", "Yes, we can discuss it. Physical samples or clear product photos help us evaluate the structure, dimensions and application."],
  ["Can you support small-batch trial production?", "Yes. Small-batch trials are suitable for validating structure, dimensions, assembly fit and early market feedback."],
  ["What information is needed for quotation?", "Product photos or drawings, dimensions, material, quantity, color, application, trial requirements and packaging needs are helpful."],
  ["What is the MOQ for injection molding?", "MOQ depends on product structure, material and processing difficulty. We can first evaluate a small-batch trial plan based on your requirement."],
  ["Can product colors be customized?", "Yes. Most plastic parts can be discussed by color, but the final plan depends on material, quantity and production conditions."],
  ["Do you support OEM/ODM?", "Yes. We support custom plastic parts based on drawings, samples or application needs, and can cooperate on long-term batch supply projects."],
  ["How long is the production lead time?", "Lead time depends on structure, quantity, material and whether samples are required. We will discuss the schedule after confirming the requirement."],
  ["Can I buy the exact styles shown on the website?", "Website photos mainly show manufacturing types and product scope. Specific dimensions and materials can be customized based on your needs."],
  ["Can you develop tooling?", "If new tooling is needed, we can discuss tooling options based on the part structure and requirement. Existing tools, drawings or samples can also be reviewed."]
];

export function InfoPageView({ kind }: { kind: PageKind }) {
  const { language, copy } = useLanguage();
  const page = copy.pages[kind];
  const isZh = language === "zh";

  if (kind === "industries") {
    const industries = isZh ? industriesZh : industriesEn;
    return (
      <>
        <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
        <section className="py-20 lg:py-28">
          <div className="section-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04} className="premium-card rounded-[2rem] p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.1)]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.products}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{item.focus}</div>
              </Reveal>
            ))}
          </div>
        </section>
        <CTA />
      </>
    );
  }

  if (kind === "faq") {
    const faqs = isZh ? faqZh : faqEn;
    return (
      <>
        <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
        <section className="py-20">
          <div className="section-shell grid gap-4">
            {faqs.map(([question, answer], index) => (
              <Reveal key={question} delay={index * 0.025} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">{question}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <CTA />
      </>
    );
  }

  if (kind === "about") {
    const features = isZh
      ? ["工厂直连，沟通更直接", "支持来图来样加工", "支持小批量试产", "可根据材料和用途沟通加工方案", "产品类型覆盖多个行业", "适合中小批量和长期供货项目", "沟通灵活，响应及时"]
      : ["Direct factory communication", "Manufacturing from drawings and samples", "Small-batch trial support", "Manufacturing plans based on material and application", "Product types across multiple industries", "Suitable for small/medium batches and long-term supply", "Flexible and responsive communication"];
    const capabilities = isZh
      ? ["注塑加工", "塑料件定制", "结构件加工", "外壳件加工", "平垫 / 垫片加工", "多行业塑料配件加工", "样品确认", "批量供货"]
      : ["Injection molding", "Custom plastic parts", "Structural part processing", "Housing parts", "Washer / gasket parts", "Multi-industry plastic fittings", "Sample confirmation", "Batch supply"];

    return (
      <>
        <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
        <section className="py-20 lg:py-28">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="eyebrow">Factory Profile</div>
              <h2 className="section-title">{isZh ? "真实、务实、适合灵活定制的注塑加工工厂" : "A practical injection molding factory for flexible custom projects"}</h2>
              <p className="section-copy">
                {isZh
                  ? "我们目前属于初创型注塑加工工厂，不把自己包装成大型集团。我们更重视实际沟通、产品适配和稳定交付，适合有图纸、样品、试产或中小批量定制需求的客户。"
                  : "We are a growing injection molding factory, not a large industrial group. We focus on practical communication, product fit and stable delivery for customers with drawings, samples, trial runs or small-to-medium batch needs."}
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item, index) => (
                <Reveal key={item} delay={index * 0.035} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-sky-600" />
                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-800">{item}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="section-shell mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
              <Reveal key={item} delay={index * 0.03} className="premium-card rounded-[1.5rem] p-5">
                <Factory className="h-5 w-5 text-sky-600" />
                <div className="mt-4 font-semibold text-slate-950">{item}</div>
              </Reveal>
            ))}
          </div>
        </section>
        <CTA />
      </>
    );
  }

  const provide = isZh ? customProvideZh : customProvideEn;
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description}>
        <Link
          href={localizedPath(language, "/contact")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          {copy.actions.quoteLong}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <Reveal>
            <div className="eyebrow">Process</div>
            <h2 className="section-title">{isZh ? "从需求沟通到包装发货，流程清楚再推进" : "A clear process from requirement review to delivery"}</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copy.process.slice(0, 6).map((step, index) => {
              const Icon = processIcons[index] ?? CheckCircle2;
              const detailsZh = [
                "客户提供产品图片、样品、图纸、尺寸、材料、数量和使用场景。",
                "根据结构、尺寸、材料、精度和使用环境判断加工方式。",
                "确认可加工性、材料选择、数量区间、交期和报价。",
                "根据需求进行小批量试样或样品确认。",
                "样品确认后进入批量加工和质量检查。",
                "根据客户要求进行包装、发货和后续沟通。"
              ];
              const detailsEn = [
                "Customer provides photos, samples, drawings, dimensions, material, quantity and application.",
                "We review structure, dimensions, material, tolerance and application environment.",
                "Manufacturability, material choice, quantity range, lead time and quotation are discussed.",
                "Small-batch samples or trial parts are confirmed when needed.",
                "Batch processing and quality checks start after sample confirmation.",
                "Packing, shipping and follow-up are arranged based on customer requirements."
              ];
              return (
                <Reveal key={step} delay={index * 0.04} className="premium-card rounded-[1.75rem] p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-sky-600" />
                    <span className="text-xs font-semibold text-slate-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{step}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{isZh ? detailsZh[index] : detailsEn[index]}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <div className="eyebrow">Inquiry Info</div>
            <h2 className="section-title">{isZh ? "为了更快报价，建议先准备这些信息" : "Information that helps us quote faster"}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {provide.map((item, index) => (
              <Reveal key={item} delay={index * 0.03} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="h-5 w-5 text-sky-600" />
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-800">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

function CTA() {
  const { language, copy } = useLanguage();
  return (
    <section className="py-20">
      <div className="section-shell">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_34px_110px_rgba(15,23,42,0.2)] md:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-sm uppercase tracking-[0.22em] text-sky-200">Inquiry</div>
              <h2 className="mt-3 text-3xl font-semibold">{copy.contact.title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{copy.contact.body}</p>
            </div>
            <Link href={localizedPath(language, "/contact")} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-1 hover:bg-sky-50">
              {copy.contact.submit}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
