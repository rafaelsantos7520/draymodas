export const dynamic = "force-dynamic";

import { StoreBanner } from "../components/StoreBanner";
import { PromotionalBanner } from "../components/PromotionalBanner";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { CategoryGrid } from "../components/CategoryGrid";
import { BestSellers } from "../components/BestSellers";
import {
  getProductFeatured,
  getProducts,
} from "@/lib/services/product.service";
import { getCategories } from "@/lib/services/category.service";
import { ProductWithRelations } from "@/types/product";

export default async function Home() {
  const [featuredProducts, allProducts, categories] = await Promise.all([
    getProductFeatured(),
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col mx-auto w-full">
      <StoreBanner />
      <PromotionalBanner />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts as ProductWithRelations[]} />
      <BestSellers products={allProducts as ProductWithRelations[]} />
    </div>
  );
}
