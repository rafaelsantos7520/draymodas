"use client";

import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Product, Category, Image as ImageType, ProductSize, Size } from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  images: ImageType[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};
interface FeaturedProductsProps {
    products: ProductWithRelations[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary">
            Coleção Especial
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary">
            Destaques da Coleção
          </h2>
          <p className="max-w-[700px] text-gray-600 text-lg leading-relaxed">
            Descubra as peças mais desejadas da nossa coleção, selecionadas
            especialmente para você
          </p>
        </div>

        <div className="flex justify-center w-full">
          <div className="w-full max-w-6xl">
            <Carousel
              className="w-full relative"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[Autoplay({ delay: 4000 })]}
            >
              <CarouselContent className="-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-6 md:basis-1/2 lg:basis-1/3"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary border-primary/20 shadow-lg" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary border-primary/20 shadow-lg" />
            </Carousel>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/catalogo">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Ver Catálogo Completo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
