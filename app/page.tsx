export const revalidate = 86400; // 24 horas

import { HeroSection } from "../components/HeroSection";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { getProductFeatured } from "@/lib/services/product.service";
import { ProductWithRelations } from "@/types/product";

export default async function Home() {
  const produtos = await getProductFeatured();

  return (
    <div className="flex flex-col mx-auto w-full">
      <HeroSection />
      <TestimonialsSection />
      <FeaturedProducts products={produtos as ProductWithRelations[]} />
    </div>
  );
}
