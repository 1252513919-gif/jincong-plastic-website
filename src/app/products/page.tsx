import type { Metadata } from "next";
import { ProductsPageView } from "@/components/ProductsPageView";

export const metadata: Metadata = {
  title: "产品中心 | 塑料平垫 汽车塑料件 电子电器塑料件",
  description:
    "邢台锦聪橡塑有限公司产品中心，展示塑料平垫/垫片、汽车塑料件、电子电器塑料配件、宠物用品塑料件、家具塑料配件，支持分类筛选、材质筛选和产品搜索。"
};

export default function ProductsPage() {
  return <ProductsPageView />;
}
