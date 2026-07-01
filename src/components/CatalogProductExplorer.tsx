"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Search, SlidersHorizontal } from "lucide-react";
import { content } from "@/i18n/site-content";
import { localizedPath, type Locale } from "@/i18n/routing";
import type { CatalogProduct } from "@/lib/product-catalog";

type CatalogProductExplorerProps = {
  products: CatalogProduct[];
  locale?: Locale;
};

const allValue = "all";

export function CatalogProductExplorer({ products, locale = "zh" }: CatalogProductExplorerProps) {
  const [category, setCategory] = useState(allValue);
  const [material, setMaterial] = useState(allValue);
  const [query, setQuery] = useState("");
  const copy = content[locale];

  const categories = useMemo(() => {
    return Array.from(
      new Map(products.map((product) => [product.category, locale === "zh" ? product.categoryZh : product.categoryEn])).entries()
    );
  }, [locale, products]);

  const materials = useMemo(() => {
    return Array.from(new Set(products.flatMap((product) => product.material))).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === allValue || product.category === category;
      const matchesMaterial = material === allValue || product.material.includes(material);
      const matchesQuery =
        keyword.length === 0 ||
        `${product.nameZh} ${product.nameEn} ${product.categoryZh} ${product.categoryEn}`.toLowerCase().includes(keyword);
      return matchesCategory && matchesMaterial && matchesQuery;
    });
  }, [category, material, products, query]);

  return (
    <div>
      <div className="premium-card rounded-[1.75rem] p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_13rem_13rem]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-electric-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.productExplorer.search}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
            />
          </label>

          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-electric-400" />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400"
            >
              <option value={allValue}>{copy.productExplorer.allCategories}</option>
              {categories.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-electric-400" />
            <select
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400"
            >
              <option value={allValue}>{copy.productExplorer.allMaterials}</option>
              {materials.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>
            {copy.productExplorer.showing} <span className="font-semibold text-slate-950">{filteredProducts.length}</span> / {products.length} {copy.productExplorer.totalSuffix}
          </span>
          {(category !== allValue || material !== allValue || query) && (
            <button
              type="button"
              onClick={() => {
                setCategory(allValue);
                setMaterial(allValue);
                setQuery("");
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              {copy.actions.reset}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={localizedPath(locale, `/products/${encodeURIComponent(product.id)}`)}
            className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-[0_28px_90px_rgba(15,23,42,0.1)]"
          >
            <div className="aspect-square w-full overflow-hidden bg-white p-4">
              <div className="relative h-full w-full">
                <Image
                  src={product.image}
                  alt={locale === "zh" ? product.nameZh : product.nameEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                  {locale === "zh" ? product.categoryZh : product.categoryEn}
                </span>
                {product.customizable && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {copy.productExplorer.customTag}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-slate-950">{locale === "zh" ? product.nameZh : product.nameEn}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{locale === "zh" ? product.nameEn : product.nameZh}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.material.slice(0, 4).map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-7 text-slate-600">{locale === "zh" ? product.usageZh : product.usageEn}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                {copy.actions.details}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
          {copy.productExplorer.empty}
        </div>
      )}
    </div>
  );
}

