import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "常见问题 | 注塑加工定制 FAQ",
  description: "注塑加工、来图来样定制、小批量试产、OEM代工、材料选择和交期相关常见问题。"
};

const faqs = [
  ["可以只做小批量试产吗？", "可以。适合新品验证、结构确认和批量生产前的试产评估。"],
  ["没有完整图纸可以沟通吗？", "可以先提供样品、照片、尺寸和用途说明，后续再确认图纸或样件细节。"],
  ["支持哪些材料？", "常见材料包括 PP、PE、ABS、PA、POM、PC、PVC 等，具体根据用途选择。"]
];

export default function FAQPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="常见问题" description="围绕注塑定制前期沟通中最常见的问题，帮助客户更快准备询盘信息。" />
      <section className="py-20">
        <div className="section-shell grid gap-4">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-lg font-semibold text-white">{question}</h2>
              <p className="mt-3 text-sm leading-7 text-steel-300">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
