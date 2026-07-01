import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogProductExplorer } from "@/components/CatalogProductExplorer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { content } from "@/i18n/site-content";
import { localizedPath, type Locale } from "@/i18n/routing";
import { catalogProducts } from "@/lib/product-catalog";

type ProductsPageViewProps = {
  locale: Locale;
};

export function ProductsPageView({ locale }: ProductsPageViewProps) {
  const copy = content[locale];
  const page = copy.pages.products;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />

      <section className="py-16 lg:py-24">
        <div className="section-shell">
          <CatalogProductExplorer products={catalogProducts} locale={locale} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="section-shell">
          <Reveal className="grid gap-5 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {locale === "zh" ? "没有找到完全匹配的产品？" : "Can not find the exact product?"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {locale === "zh"
                  ? "可以发送图纸、样品照片、尺寸或用途说明，我们会根据实际需求评估材料、模具和生产方式。"
                  : "Send drawings, sample photos, dimensions or application notes. We will evaluate material, tooling and production approach."}
              </p>
            </div>
            <Link
              href={localizedPath(locale, "/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              {copy.actions.quote}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
