import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogProductExplorer } from "@/components/CatalogProductExplorer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { catalogProducts } from "@/lib/product-catalog";

export const metadata: Metadata = {
  title: "产品中心 | 塑料平垫 汽车塑料件 电子电器塑料件",
  description:
    "邢台锦聪橡塑有限公司产品中心，展示塑料平垫/垫片、汽车塑料件、电子电器塑料配件、宠物用品塑料件、家具塑料配件，支持分类筛选、材质筛选和产品搜索。",
  keywords: ["塑料平垫", "塑料垫片", "汽车塑料件", "电子电器塑料件", "宠物用品塑料件", "家具塑料配件", "注塑加工"]
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="产品中心"
        description="按真实产品图片自动生成产品库，支持分类、材质和名称搜索。所有产品均可围绕图纸、样品、材料、颜色、尺寸和包装要求进行注塑定制。"
      />

      <section className="py-16 lg:py-24">
        <div className="section-shell">
          <CatalogProductExplorer products={catalogProducts} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="section-shell">
          <Reveal className="grid gap-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">没有找到完全匹配的产品？</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                可以发送图纸、样品照片、尺寸或用途说明，我们会根据实际需求评估材料、模具和生产方式。
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              发送图纸获取报价
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
