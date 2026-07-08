"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, Factory, Layers3, Mail, PackageCheck, Phone, Wrench } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { site } from "@/lib/site";

type PageKind = "custom" | "industries" | "about" | "faq";

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
  { title: "Electrical & Electronic", products: "Switch fittings, junction boxes, battery boxes, wire clips, end caps, protective covers and fixing bases.", focus: "Insulation, dimensional stability, flame-retardant needs and positioning." },
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
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700">
                  <Layers3 className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.products}</p>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-7 text-slate-700">{item.focus}</div>
              </Reveal>
            ))}
          </div>
        </section>
        <LightCTA variant="industries" />
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
      </>
    );
  }

  if (kind === "about") {
    return (
      <>
        <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
        <section className="py-20 lg:py-28">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <Reveal>
              <div className="eyebrow">Factory Profile</div>
              <h2 className="section-title">{isZh ? "专注塑料零部件定制加工" : "Focused on Custom Plastic Parts Manufacturing"}</h2>
              <div className="section-copy space-y-4">
                <p>
                  {isZh
                    ? "邢台锦聪橡塑有限公司从事注塑加工与塑料零部件定制，面向宠物用品、电子电气、家具配件、平垫、汽车塑料件等多个应用场景。"
                    : "Xingtai Jincong Rubber & Plastic Co., Ltd. provides injection molding and custom plastic parts manufacturing for pet products, electrical and electronic parts, furniture fittings, flat washers, automotive plastic parts and other application scenarios."}
                </p>
                <p>
                  {isZh
                    ? "我们支持来图、来样、按产品图片沟通需求，可根据产品用途、材料、尺寸、数量和使用环境，协助确认加工方案。相比夸大规模，我们更重视前期确认、试产验证、沟通效率和稳定交付。"
                    : "We support requirement review based on drawings, samples and product photos. Processing plans can be discussed according to application, material, dimension, quantity and use environment. Instead of overstating scale, we value early confirmation, trial verification, responsive communication and stable delivery."}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4">
              <div className="premium-card rounded-[2rem] p-7">
                <Factory className="h-7 w-7 text-sky-600" />
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{isZh ? "工厂直连，沟通更直接" : "Factory-direct communication"}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {isZh ? "需求、材料、样品和数量可以直接沟通，便于更快确认加工方向。" : "Requirements, materials, samples and quantities can be discussed directly for faster manufacturing review."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {(isZh ? ["来图来样加工", "支持小批量试产", "材料与用途确认"] : ["Drawing & Sample Customization", "Small-Batch Trial Production", "Material & Application Confirmation"]).map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-800 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/70 p-5 text-sm font-medium leading-7 text-sky-900">
                {isZh ? "适合样品开发、中小批量定制和长期供货项目。" : "Suitable for sample development, small-to-medium batch customization, and long-term supply projects."}
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-lg font-semibold text-slate-950 shadow-sm">
                {isZh ? "响应及时，方案灵活。" : "Responsive communication and flexible solutions."}
              </div>
            </Reveal>
          </div>
        </section>
        <LightCTA variant="about" />
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
          <ProcessFlow />
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
      <LightCTA variant="custom" />
    </>
  );
}

function ProcessFlow() {
  const { copy } = useLanguage();
  return (
    <div className="mt-12">
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {copy.process.slice(0, 4).map((step: string, index: number) => (
            <ProcessNode key={step} index={index} title={step} detail={copy.processDetails[index]} direction="right" />
          ))}
        </div>
        <div className="ml-auto mr-[12.5%] flex h-12 w-px items-end justify-center bg-sky-200">
          <span className="mb-[-2px] h-2 w-2 rotate-45 border-b border-r border-sky-400" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div />
          {copy.process.slice(4).reverse().map((step: string, offset: number) => {
            const index = 6 - offset;
            return <ProcessNode key={step} index={index} title={step} detail={copy.processDetails[index]} direction="left" />;
          })}
        </div>
      </div>
      <div className="grid lg:hidden">
        {copy.process.map((step: string, index: number) => (
          <ProcessNode key={step} index={index} title={step} detail={copy.processDetails[index]} direction="down" />
        ))}
      </div>
    </div>
  );
}

function ProcessNode({ index, title, detail, direction }: { index: number; title: string; detail: string; direction: "right" | "left" | "down" }) {
  const Icon = [ClipboardCheck, Wrench, Layers3, CheckCircle2, Factory, PackageCheck, CheckCircle2][index] ?? CheckCircle2;
  return (
    <Reveal delay={index * 0.04} className="relative">
      <div className="min-h-full rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-sky-600" />
          <span className="text-xs font-semibold text-sky-600">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{detail}</p>
      </div>
      {direction !== "down" && index !== 3 && index !== 6 && (
        <span className={`absolute top-1/2 hidden h-px w-6 bg-sky-300 lg:block ${direction === "right" ? "-right-5" : "-left-5"}`}>
          <span className={`absolute -top-1 h-2 w-2 rotate-45 border-sky-400 ${direction === "right" ? "right-0 border-r border-t" : "left-0 border-b border-l"}`} />
        </span>
      )}
      {direction === "down" && index < 6 && (
        <span className="mx-auto block h-9 w-px bg-sky-300">
          <span className="mx-auto mt-7 block h-2 w-2 rotate-45 border-b border-r border-sky-400" />
        </span>
      )}
    </Reveal>
  );
}

function LightCTA({ variant }: { variant: "custom" | "industries" | "about" }) {
  const { language, copy } = useLanguage();
  const isZh = language === "zh";
  const title = {
    custom: isZh ? "从样品确认到批量生产，我们协助推进" : "From sample confirmation to batch production",
    industries: isZh ? "有具体应用场景？可以按用途沟通材料和结构" : "Have a specific application scenario?",
    about: isZh ? "有塑料件定制需求？把图纸或样品发给我们" : "Have a custom plastic part requirement?"
  }[variant];

  return (
    <section className="py-16">
      <div className="section-shell">
        <Reveal className="premium-card rounded-[2rem] p-7 md:p-9">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="eyebrow">{isZh ? "联系沟通" : "Inquiry"}</div>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{copy.contact.body}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-sky-600" />{copy.contact.phone}: {site.phone}</span>
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-sky-600" />{copy.contact.email}: {site.email}</span>
              </div>
            </div>
            <Link href={localizedPath(language, "/contact")} className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-sky-700">
              {copy.contact.submit}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
