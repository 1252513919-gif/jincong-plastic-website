"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, Layers3 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { getCatalogProductById } from "@/lib/product-catalog";
import { getProductBySlug } from "@/lib/products";

type ProductDetailPageViewProps = {
  slug: string;
};

export function ProductDetailPageView({ slug }: ProductDetailPageViewProps) {
  const { language, copy } = useLanguage();
  const product = getCatalogProductById(slug);

  if (product) {
    const title = language === "zh" ? product.nameZh : product.nameEn;
    const category = language === "zh" ? product.categoryZh : product.categoryEn;
    const subCategory = language === "zh" ? product.subCategoryZh : product.subCategoryEn;
    const usage = language === "zh" ? product.usageZh : product.usageEn;
    const industries = language === "zh" ? product.industriesZh || product.industries : product.industriesEn || product.industries;

    return (
      <>
        <PageHero eyebrow={category} title={title} description={usage}>
          <div className="mt-8 flex flex-wrap gap-3">
            {product.material.map((material) => (
              <span key={material} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                {material}
              </span>
            ))}
          </div>
        </PageHero>

        <section className="py-16 lg:py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={product.image}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div>
              <Link href={localizedPath(language, "/products")} className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-sky-700">
                <ArrowLeft className="h-4 w-4" />
                {language === "zh" ? "返回产品中心" : "Back to products"}
              </Link>

              <div className="mt-8 premium-card rounded-[2rem] p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                    {category}
                  </span>
                  {subCategory && (
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                      {subCategory}
                    </span>
                  )}
                  {product.customizable && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                      <BadgeCheck className="h-3.5 w-3.5 text-sky-600" />
                      {copy.productExplorer.customTag}
                    </span>
                  )}
                </div>

                <h1 className="mt-6 text-3xl font-semibold text-slate-950 sm:text-4xl">{title}</h1>

                <div className="mt-8 grid gap-5">
                  <DetailBlock title={language === "zh" ? "所属分类" : "Category"} items={subCategory ? [category, subCategory] : [category]} />
                  <DetailBlock title={language === "zh" ? "可选材质" : "Available Materials"} items={product.material} />
                  <DetailBlock title={language === "zh" ? "主要用途" : "Application"} items={[usage]} />
                  <DetailBlock title={language === "zh" ? "适用行业" : "Industries"} items={industries} />
                </div>

                <Link
                  href={localizedPath(language, "/contact")}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700 sm:w-auto"
                >
                  {language === "zh" ? "咨询该产品报价" : "Request a Quote"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const legacyProduct = getProductBySlug(slug);
  if (!legacyProduct) {
    return null;
  }

  return (
    <>
      <PageHero eyebrow={legacyProduct.category} title={legacyProduct.name} description={legacyProduct.summary}>
        <div className="mt-8 flex flex-wrap gap-3">
          {legacyProduct.materials.map((material) => (
            <span key={material} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
              {material}
            </span>
          ))}
        </div>
      </PageHero>
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <div className="premium-card rounded-[2rem] p-8">
            <Layers3 className="h-8 w-8 text-sky-600" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">
              {language === "zh" ? "该分类支持来图来样定制" : "This category supports custom manufacturing"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{legacyProduct.summary}</p>
            <Link href={localizedPath(language, "/contact")} className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700">
              {copy.contact.submit}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm text-slate-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
