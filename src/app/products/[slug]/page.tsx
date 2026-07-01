import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, Layers3 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { catalogProducts, getCatalogProductById } from "@/lib/product-catalog";
import { getProductBySlug, productList } from "@/lib/products";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [
    ...catalogProducts.map((product) => ({ slug: product.id })),
    ...productList.map((product) => ({ slug: product.slug }))
  ];
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProductById(slug);
  if (product) {
    return {
      title: `${product.nameZh} | 注塑加工定制`,
      description: `${product.nameZh}属于${product.categoryZh}，支持来图来样定制、小批量试产、OEM代工和工厂直供。`,
      keywords: [product.nameZh, product.nameEn, product.categoryZh, ...product.material, "注塑加工", "塑料件定制"]
    };
  }

  const legacyProduct = getProductBySlug(slug);
  if (!legacyProduct) return {};

  return {
    title: `${legacyProduct.name} | 注塑加工定制`,
    description: `${legacyProduct.name}支持来图来样定制、小批量试产、OEM代工和工厂直供。${legacyProduct.summary}`,
    keywords: [legacyProduct.name, legacyProduct.englishName, "注塑加工", "塑料件定制", ...legacyProduct.materials]
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getCatalogProductById(slug);

  if (product) {
    return (
      <>
        <PageHero eyebrow={product.categoryZh} title={product.nameZh} description={product.usageZh}>
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
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image}
                  alt={product.nameZh}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div>
              <Link href="/products" className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-sky-700">
                <ArrowLeft className="h-4 w-4" />
                返回产品中心
              </Link>

              <div className="mt-8 glass-panel rounded-[1.75rem] p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                    {product.categoryZh}
                  </span>
                  {product.customizable && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                      <BadgeCheck className="h-3.5 w-3.5 text-electric-400" />
                      支持定制
                    </span>
                  )}
                  {product.needsReview && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
                      名称待确认
                    </span>
                  )}
                </div>

                <h1 className="mt-6 text-3xl font-semibold text-slate-950 sm:text-4xl">{product.nameZh}</h1>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-400">{product.nameEn}</p>

                <div className="mt-8 grid gap-5">
                  <DetailBlock title="所属分类" items={[product.categoryZh, product.categoryEn]} />
                  <DetailBlock title="可选材质" items={product.material} />
                  <DetailBlock title="主要用途" items={[product.usageZh, product.usageEn]} />
                  <DetailBlock title="适用行业" items={product.industries} />
                </div>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700 sm:w-auto"
                >
                  咨询该产品报价
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
    notFound();
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
          <div className="glass-panel rounded-[1.75rem] p-8">
            <Layers3 className="h-8 w-8 text-electric-400" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">该分类支持来图来样定制</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{legacyProduct.summary}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              提交定制需求
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
            <CheckCircle2 className="h-3.5 w-3.5 text-electric-400" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

