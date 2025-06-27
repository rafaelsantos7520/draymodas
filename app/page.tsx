import { FeaturedProducts } from "@/components/FeaturedProducts";
import { BestSellers } from "../components/BestSellers";
import {
  getProductFeatured,
  getProducts,
} from "@/lib/services/product.service";
import { getCategories } from "@/lib/services/category.service";
import { ProductWithRelations } from "@/types/product";
import { HeroBanner } from "@/components/HeroBanner";

export const revalidate = 300;

export default async function Home() {
  const [featuredProducts, allProducts, categories] = await Promise.all([
    getProductFeatured(),
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col mx-auto w-full">
      <HeroBanner />
      <FeaturedProducts products={featuredProducts as ProductWithRelations[]} />
      <BestSellers products={allProducts as ProductWithRelations[]} />
    </div>
  );
}
