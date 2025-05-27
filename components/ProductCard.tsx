"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { memo, useState } from "react";
import { Product, Category, Image as ImageType, ProductSize, Size } from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  images: ImageType[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};
interface ProductCardProps {
  product: ProductWithRelations;
}

export const ProductCard = memo(
  ({ product }: ProductCardProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white transform hover:-translate-y-2">
        <Link href={`/produto/${product.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">{product.name}</span>
        </Link>

        <div className="relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gray-100 ${
              imageLoaded ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
          />
          <Image
            src={product.images[0]?.url || "/ placeholder.svg"}
            alt={product.name}  
            width={350}
            height={450}
            className={`object-cover w-full aspect-[3/4] transition-transform duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            quality={75}
            onLoad={() => setImageLoaded(true)}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-primary text-lg truncate group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {product.category?.name || "Sem categoria"}
            </Badge>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.9)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.product.id === nextProps.product.id
);

ProductCard.displayName = "ProductCard";
