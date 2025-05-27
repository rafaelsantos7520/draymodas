import { FloatingWhatsApp } from "react-floating-whatsapp";
import { HeroSection } from "../components/HeroSection";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { AboutSection } from "../components/AboutSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { getProductFeatured } from "@/lib/services/product.service";
import { Product, Category, Image, ProductSize, Size } from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  images: Image[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};

export default async function Home() {
  const produtos = await getProductFeatured();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        {/* <FeaturedProducts products={produtos} /> */}
        <AboutSection />
        <TestimonialsSection />
      </main>
      <FeaturedProducts products={produtos as ProductWithRelations[]} />
    </div>
  );
}
