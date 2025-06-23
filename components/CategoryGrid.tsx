"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="w-full py-4 md:py-8 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
            Nossas Categorias
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Explore nossa variedade de produtos organizados por categoria
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/catalogo?categoria=${category.id}`}>
              <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-gray-200 hover:border-gray-300 min-w-[80px] md:min-w-[140px]">
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="w-8 h-8 md:w-14 md:h-14 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-pink-100 transition-colors">
                    <span className="text-sm md:text-xl">👗</span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors text-xs md:text-base">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
