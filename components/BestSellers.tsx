"use client";

import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { ProductWithRelations } from "@/types/product";

interface BestSellersProps {
  products: ProductWithRelations[];
}

export function BestSellers({ products }: BestSellersProps) {
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-pink-500" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Mais Vendidos
              </h2>
              <p className="text-gray-600">
                Os produtos mais populares da nossa loja
              </p>
            </div>
          </div>
          <Link href="/catalogo">
            <Button
              variant="outline"
              className="hidden md:flex border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Ver Todos
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <div key={product.id} className="relative">
              {index < 3 && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-pink-500/90 backdrop-blur-sm text-white text-xs border-0 shadow-lg">
                    #{index + 1} Mais Vendido
                  </Badge>
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/catalogo">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Ver Todos os Produtos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
