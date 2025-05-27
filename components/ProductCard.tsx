"use client";

import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductLink } from "@/components/ProductLink";
import { ProductWithRelations } from "@/types/product";
import { memo, useState } from "react";

interface ProductCardProps {
  product: ProductWithRelations;
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <ProductLink href={`/produto/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </ProductLink>
  );
});

ProductCard.displayName = "ProductCard";
