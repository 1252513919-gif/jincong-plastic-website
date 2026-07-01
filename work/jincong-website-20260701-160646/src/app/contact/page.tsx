import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "联系我们 | 注塑加工询盘",
  description: "联系邢台锦聪橡塑有限公司，提交塑料件注塑加工、来图来样定制、小批量试产、OEM代工询盘需求。",
  keywords: ["注塑加工询盘", "塑料件定制联系方式", "邢台锦聪橡塑有限公司"]
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="联系我们"
        description="发送图纸、样品信息、产品用途或采购数量，我们会根据需求评估注塑加工方案。"
      />
      <section className="py-20 lg:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="space-y-5">
            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white">询盘信息</h2>
              <p className="mt-4 text-sm leading-7 text-steel-300">
                为便于快速判断，请尽量提供尺寸、材质、颜色、数量、用途、是否有图纸或样品等信息。
              </p>
            </div>
            {[
              { icon: Phone, label: "电话 / 微信", value: site.phone },
              { icon: Mail, label: "邮箱", value: site.email },
              { icon: MapPin, label: "所在地", value: site.location }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
                <Icon className="h-5 w-5 text-electric-400" />
                <div className="mt-4 text-sm text-steel-500">{label}</div>
                <div className="mt-1 font-semibold text-white">{value}</div>
              </div>
            ))}
          </aside>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
