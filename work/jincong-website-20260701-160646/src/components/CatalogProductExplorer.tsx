"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Search, SlidersHorizontal } from "lucide-react";
import type { CatalogProduct } from "@/lib/product-catalog";

type CatalogProductExplorerProps = {
  products: CatalogProduct[];
};

const allValue = "all";

export function CatalogProductExplorer({ products }: CatalogProductExplorerProps) {
  const [category, setCategory] = useState(allValue);
  const [material, setMaterial] = useState(allValue);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    return Array.from(new Map(products.map((product) => [product.category, product.categoryZh])).entries());
  }, [products]);

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
      <div className="glass-panel rounded-lg p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_13rem_13rem]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-electric-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索产品名称、英文名或分类"
              className="h-12 w-full rounded-md border border-white/10 bg-graphite-950/72 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-steel-500 focus:border-electric-400"
            />
          </label>

          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-electric-400" />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-md border border-white/10 bg-graphite-950/72 pl-11 pr-4 text-sm text-white outline-none transition focus:border-electric-400"
            >
              <option value={allValue}>全部分类</option>
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
              className="h-12 w-full rounded-md border border-white/10 bg-graphite-950/72 pl-11 pr-4 text-sm text-white outline-none transition focus:border-electric-400"
            >
              <option value={allValue}>全部材质</option>
              {materials.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-steel-300">
          <span>
            当前展示 <span className="font-semibold text-white">{filteredProducts.length}</span> / {products.length} 个产品
          </span>
          {(category !== allValue || material !== allValue || query) && (
            <button
              type="button"
              onClick={() => {
                setCategory(allValue);
                setMaterial(allValue);
                setQuery("");
              }}
              className="rounded-md border border-white/10 px-3 py-2 text-xs text-white transition hover:border-electric-400/60"
            >
              清空筛选
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${encodeURIComponent(product.id)}`}
            className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-card-glow transition duration-300 hover:-translate-y-2 hover:border-electric-400/45 hover:bg-white/[0.075]"
          >
            <div className="aspect-square w-full overflow-hidden bg-white p-4">
              <div className="relative h-full w-full">
                <Image
                  src={product.image}
                  alt={product.nameZh}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/10 bg-white/[0.045] px-2.5 py-1 text-xs text-steel-300">
                  {product.categoryZh}
                </span>
                {product.customizable && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-electric-400/15 px-2.5 py-1 text-xs font-semibold text-electric-400">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    支持来图来样定制
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white">{product.nameZh}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-steel-500">{product.nameEn}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.material.slice(0, 4).map((item) => (
                  <span key={item} className="rounded-md border border-white/10 bg-white/[0.045] px-2.5 py-1 text-xs text-steel-300">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-7 text-steel-300">{product.usageZh}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                查看详情
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.045] p-8 text-center text-steel-300">
          没有匹配的产品，可调整筛选条件或直接提交图纸需求。
        </div>
      )}
    </div>
  );
}

