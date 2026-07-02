import type { Metadata } from "next";
import { ProductDetailPageView } from "@/components/ProductDetailPageView";
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
      description: `${product.nameZh}属于${product.categoryZh}，支持来图来样定制、小批量试产、OEM代工和工厂直供。`
    };
  }

  const legacyProduct = getProductBySlug(slug);
  if (!legacyProduct) return {};

  return {
    title: `${legacyProduct.name} | 注塑加工定制`,
    description: `${legacyProduct.name}支持来图来样定制、小批量试产、OEM代工和工厂直供。`
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailPageView slug={slug} />;
}
