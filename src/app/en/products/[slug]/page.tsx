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
      title: `${product.nameEn} | Custom Injection Molding`,
      description: `${product.nameEn} in ${product.categoryEn}, available for drawing/sample customization, small-batch trial production and OEM.`
    };
  }

  const legacyProduct = getProductBySlug(slug);
  if (!legacyProduct) return {};

  return {
    title: `${legacyProduct.englishName} | Custom Injection Molding`,
    description: `${legacyProduct.englishName} supports custom injection molding and OEM processing.`
  };
}

export default async function EnglishProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailPageView slug={slug} locale="en" />;
}
