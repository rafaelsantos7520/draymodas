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
  // Limitar a 4 produtos para melhor performance
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-brand-primary" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Mais Vendidos
              </h2>
              <p className="text-gray-600 text-sm">
                Os produtos mais populares
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {displayProducts.map((product, index) => (
            <div key={product.id} className="relative">
              {index < 2 && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-brand-primary/90 backdrop-blur-sm text-white text-xs border-0 shadow-lg">
                    #{index + 1} Mais Vendido
                  </Badge>
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/catalogo">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary-dark text-white"
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
