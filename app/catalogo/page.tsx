"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: { url: string }[];
  isNew?: boolean;
  isSale?: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

// Componente de categorias em chips para mobile
const CategoryChips = memo(
  ({
    selectedCategory,
    categories,
    onCategoryChange,
  }: {
    selectedCategory: string;
    categories: Category[];
    onCategoryChange: (categoryId: string) => void;
  }) => (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onCategoryChange("")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? "bg-pink-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-pink-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
);

CategoryChips.displayName = "CategoryChips";

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { ref: loadMoreRef, inView } = useInView();

  // Pegar categoria da URL params
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    if (categoriaParam) {
      setSelectedCategory(categoriaParam);
    }
  }, [searchParams]);

  const buildFilters = useCallback(() => {
    const filters: Record<string, string> = {};
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    if (sortBy !== "relevancia") filters.sort = sortBy;
    return filters;
  }, [selectedCategory, searchQuery, sortBy]);

  // Query para categorias
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/admin/categories");
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query infinita para produtos
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products", buildFilters()],
    queryFn: async ({ pageParam = 1 }) => {
      const filters = { ...buildFilters(), page: pageParam.toString() };
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`/api/products?${queryParams}`);
      return response.data as ProductResponse;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60, // 1 minuto
  });

  // Carregar mais produtos quando o usuário chegar ao final da página
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div className="min-h-screen mx-auto border border-gray-200 w-full">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Catálogo
          </h1>
          <p className="text-gray-600">
            Descubra nossa coleção completa de moda feminina
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Main Content */}
        <main className="w-full">
          {/* Search Bar - Always Visible */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                name="search"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Category Chips - Mobile */}
          <div className="lg:hidden bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Categorias</h3>
            <CategoryChips
              selectedCategory={selectedCategory}
              categories={categories}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Category Chips - Desktop */}
          <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              Filtrar por Categoria
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas as Categorias
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-pink-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters Bar + Sort */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="text-gray-600 text-sm">
                  {data?.pages.reduce(
                    (total, page) => total + (page.data?.length || 0),
                    0
                  )}{" "}
                  produtos encontrados
                </div>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevância</SelectItem>
                  <SelectItem value="menor-preco">Menor Preço</SelectItem>
                  <SelectItem value="maior-preco">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {data?.pages.map((page) =>
                page.data.map((product: Product) => (
                  <Link key={product.id} href={`/produto/${product.id}`}>
                    <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                      <div className="relative flex-shrink-0 aspect-[3/4]">
                        <Image
                          src={
                            product.images[0]?.url || "/productCardDefault.png"
                          }
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && (
                            <Badge className="bg-pink-500/90 backdrop-blur-sm text-white text-xs border-0 shadow-lg">
                              Novo
                            </Badge>
                          )}
                          {product.isSale && (
                            <Badge className="bg-red-500/90 backdrop-blur-sm text-white text-xs border-0 shadow-lg">
                              Promoção
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-auto">
                          <span className="text-base sm:text-lg font-bold text-pink-600">
                            R$ {product.price.toFixed(2).replace(".", ",")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              R${" "}
                              {product.originalPrice
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          )}

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-10" />

          {/* Error state */}
          {isError && (
            <div className="text-center py-8">
              <p className="text-red-500">
                Erro ao carregar produtos. Tente novamente.
              </p>
              <Button
                onClick={() => fetchNextPage()}
                className="mt-4"
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && data?.pages[0]?.data.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum produto encontrado.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
