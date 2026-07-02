import type { Metadata } from "next";
import { ProductsPageView } from "@/components/ProductsPageView";

export const metadata: Metadata = {
  title: "Product Center | Custom Plastic Parts",
  description:
    "Product center for plastic washers, automotive plastic parts, electronic plastic parts, pet plastic products and furniture plastic fittings."
};

export default function EnglishProductsPage() {
  return <ProductsPageView />;
}
