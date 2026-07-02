"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogProductExplorer } from "@/components/CatalogProductExplorer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { catalogProducts } from "@/lib/product-catalog";

export function ProductsPageView() {
  const { language, copy } = useLanguage();
  const page = copy.pages.products;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />

      <section className="py-16 lg:py-24">
        <div className="section-shell">
          <CatalogProductExplorer products={catalogProducts} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="section-shell">
          <Reveal className="grid gap-5 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {language === "zh" ? "产品图片只是部分加工示例" : "Product photos show part of our manufacturing scope"}
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{copy.productExplorer.note}</p>
            </div>
            <Link
              href={localizedPath(language, "/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              {copy.actions.quoteLong}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
