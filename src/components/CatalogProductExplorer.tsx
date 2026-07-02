"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Search, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import type { CatalogProduct } from "@/lib/product-catalog";

type CatalogProductExplorerProps = {
  products: CatalogProduct[];
};

const allValue = "all";

const categoryFallback: Record<string, { zh: string; en: string }> = {
  "pet-plastic-products": { zh: "宠物用品系列", en: "Pet Plastic Products" },
  "electronic-electrical-plastic-parts": { zh: "电子电气塑料件系列", en: "Electronic & Electrical Plastic Parts" },
  "furniture-plastic-fittings": { zh: "家具塑料配件系列", en: "Furniture Plastic Fittings" },
  "plastic-washers": { zh: "平垫系列", en: "Plastic Washers / Gaskets" },
  "automotive-plastic-parts": { zh: "汽车塑料件系列", en: "Automotive Plastic Parts" }
};

function getSubCategory(product: CatalogProduct) {
  const parts = product.image.split("/").filter(Boolean);
  return parts.length >= 4 ? parts[3] : "";
}

function getSeriesLabel(slug: string, language: "zh" | "en", product?: CatalogProduct) {
  const fallback = categoryFallback[slug];
  if (fallback) return language === "zh" ? fallback.zh : fallback.en;
  if (!product) return slug;
  return language === "zh" ? product.categoryZh : product.categoryEn;
}

export function CatalogProductExplorer({ products }: CatalogProductExplorerProps) {
  const { language, copy } = useLanguage();
  const [series, setSeries] = useState(allValue);
  const [subCategory, setSubCategory] = useState(allValue);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const available = new Map(products.map((product) => [product.category, product]));
    return Object.keys(categoryFallback)
      .filter((slug) => available.has(slug))
      .map((slug) => ({
        slug,
        label: getSeriesLabel(slug, language, available.get(slug))
      }));
  }, [language, products]);

  const subCategories = useMemo(() => {
    const scoped = series === allValue ? products : products.filter((product) => product.category === series);
    return Array.from(new Set(scoped.map(getSubCategory).filter(Boolean))).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  }, [products, series]);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) => {
      const productSubCategory = getSubCategory(product);
      const matchesSeries = series === allValue || product.category === series;
      const matchesSubCategory = subCategory === allValue || productSubCategory === subCategory;
      const matchesQuery =
        keyword.length === 0 ||
        `${product.nameZh} ${product.nameEn} ${product.categoryZh} ${product.categoryEn} ${productSubCategory}`.toLowerCase().includes(keyword);
      return matchesSeries && matchesSubCategory && matchesQuery;
    });
  }, [products, query, series, subCategory]);

  return (
    <div>
      <div className="premium-card rounded-[1.75rem] p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_15rem_15rem]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.productExplorer.search}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
            />
          </label>

          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <select
              value={series}
              onChange={(event) => {
                setSeries(event.target.value);
                setSubCategory(allValue);
              }}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400"
            >
              <option value={allValue}>{copy.productExplorer.allSeries}</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
            <select
              value={subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400"
            >
              <option value={allValue}>{copy.productExplorer.allSubcategories}</option>
              {subCategories.map((item) => (
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
          {(series !== allValue || subCategory !== allValue || query) && (
            <button
              type="button"
              onClick={() => {
                setSeries(allValue);
                setSubCategory(allValue);
                setQuery("");
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              {copy.actions.reset}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => {
              setSeries(item.slug);
              setSubCategory(allValue);
            }}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              series === item.slug
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-slate-950"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => {
          const title = language === "zh" ? product.nameZh : product.nameEn;
          const sub = getSubCategory(product);
          return (
            <Link
              key={product.id}
              href={localizedPath(language, `/products/${encodeURIComponent(product.id)}`)}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-[0_28px_90px_rgba(15,23,42,0.1)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-50 to-white p-3">
                <div className="relative h-full w-full">
                  <Image
                    src={product.image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain object-center transition duration-500 group-hover:scale-[1.035]"
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                    {getSeriesLabel(product.category, language, product)}
                  </span>
                  {sub && (
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500">
                      {sub}
                    </span>
                  )}
                  {product.customizable && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {copy.productExplorer.customTag}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{language === "zh" ? product.nameEn : product.nameZh}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.material.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-7 text-slate-600">{language === "zh" ? product.usageZh : product.usageEn}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                  {copy.actions.details}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
          {copy.productExplorer.empty}
        </div>
      )}
    </div>
  );
}
