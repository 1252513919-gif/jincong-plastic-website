"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Boxes, CheckCircle2 } from "lucide-react";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-card-glow"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {product.image ? (
          <div className="aspect-square w-full overflow-hidden bg-white p-4">
            <div className="relative h-full w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        ) : (
          <div className={`relative h-52 bg-gradient-to-br ${product.gradient}`}>
            <div className="absolute inset-0 industrial-grid opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/82 via-graphite-950/15 to-transparent" />
            <div className="absolute left-6 top-6 rounded-md border border-white/15 bg-graphite-950/50 p-3 backdrop-blur">
              <Boxes className="h-7 w-7 text-electric-400" />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/70">{product.category}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{product.name}</div>
            </div>
            <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-md bg-white text-graphite-950 opacity-0 transition group-hover:opacity-100">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="text-sm uppercase tracking-[0.16em] text-steel-500">{product.englishName}</div>
          <p className="mt-4 min-h-[5rem] text-sm leading-7 text-steel-300">{product.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.capabilities.slice(0, 3).map((item) => (
              <span key={item} className="inline-flex items-center gap-1 rounded-md bg-white/8 px-3 py-1.5 text-xs text-steel-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-electric-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
