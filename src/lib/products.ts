import products from "@/data/products.json";

export type Product = {
  slug: string;
  name: string;
  englishName: string;
  category: string;
  summary: string;
  materials: string[];
  capabilities: string[];
  applications: string[];
  gradient: string;
  image?: string;
};

export const productList = products as Product[];

export function getProductBySlug(slug: string) {
  return productList.find((product) => product.slug === slug);
}
