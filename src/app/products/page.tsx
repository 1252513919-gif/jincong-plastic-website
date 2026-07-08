import type { Metadata } from "next";
import { ProductsPageView } from "@/components/ProductsPageView";

export const metadata: Metadata = {
  title: "产品中心 | 塑料件注塑加工产品系列",
  description:
    "邢台锦聪橡塑有限公司产品中心，展示宠物用品塑料件、电子电气塑料件、家具塑料配件、平垫系列和汽车塑料件，支持来图来样加工、小批量试产和 OEM/ODM 定制。"
};

export default function ProductsPage() {
  return <ProductsPageView />;
}
