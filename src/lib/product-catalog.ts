import products from "../../data/products.json";
import categoryMap from "../../data/category-map.json";

export type CatalogProduct = {
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  subCategoryZh?: string;
  subCategoryEn?: string;
  image: string;
  material: string[];
  usageZh: string;
  usageEn: string;
  industries: string[];
  industriesZh?: string[];
  industriesEn?: string[];
  customizable: boolean;
  needsReview: boolean;
};

export type CatalogCategory = {
  categoryZh: string;
  categoryEn: string;
  defaultMaterial: string[];
  usageZh: string;
  usageEn: string;
  industries: string[];
  industriesZh?: string[];
  industriesEn?: string[];
};

export const catalogProducts = products as CatalogProduct[];
export const catalogCategoryMap = categoryMap as Record<string, CatalogCategory>;

export function getCatalogProductById(id: string) {
  return catalogProducts.find((product) => product.id === decodeURIComponent(id));
}

export function getCatalogCategories() {
  return Object.entries(catalogCategoryMap).map(([slug, category]) => ({
    slug,
    ...category
  }));
}
