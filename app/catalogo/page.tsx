"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

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

// Componente dos filtros para reutilizar
const FiltersContent = memo(
  ({
    selectedCategory,
    priceRange,
    appliedPriceRange,
    categories,
    onCategoryChange,
    onPriceChange,
    onApplyPriceFilter,
    onClearFilters,
  }: {
    selectedCategory: string;
    priceRange: { min: string; max: string };
    appliedPriceRange: { min: string; max: string };
    categories: Category[];
    onCategoryChange: (categoryId: string) => void;
    onPriceChange: (type: "min" | "max", value: string) => void;
    onApplyPriceFilter: () => void;
    onClearFilters: () => void;
  }) => (
    <div className="space-y-6">
      {/* Categorias */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Categorias</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              !selectedCategory
                ? "bg-emerald-100 text-emerald-700 font-medium border border-emerald-200"
                : "text-gray-600 hover:bg-gray-100 border border-transparent"
            }`}
          >
            Todas as categorias
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-emerald-100 text-emerald-700 font-medium border border-emerald-200"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Faixa de Preço</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Mínimo"
              value={priceRange.min}
              onChange={(e) => onPriceChange("min", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={priceRange.max}
              onChange={(e) => onPriceChange("max", e.target.value)}
            />
          </div>
          <Button
            onClick={onApplyPriceFilter}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Aplicar Filtro
          </Button>
        </div>
      </div>

      {/* Limpar Filtros */}
      {(selectedCategory || appliedPriceRange.min || appliedPriceRange.max) && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  )
);

FiltersContent.displayName = "FiltersContent";

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [appliedPriceRange, setAppliedPriceRange] = useState({
    min: "",
    max: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { ref: loadMoreRef, inView } = useInView();

  const buildFilters = useCallback(() => {
    const filters: Record<string, string> = {};
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (appliedPriceRange.min) filters.minPrice = appliedPriceRange.min;
    if (appliedPriceRange.max) filters.maxPrice = appliedPriceRange.max;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    if (sortBy !== "relevancia") filters.sort = sortBy;
    return filters;
  }, [selectedCategory, appliedPriceRange, searchQuery, sortBy]);

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

  const debouncedSearch = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      // A busca será refeita automaticamente pelo React Query
    }, 500);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setFiltersOpen(false);
  }, []);

  const handlePriceChange = useCallback(
    (type: "min" | "max", value: string) => {
      setPriceRange((prev) => ({ ...prev, [type]: value }));
    },
    []
  );

  const applyPriceFilter = useCallback(() => {
    setAppliedPriceRange(priceRange);
    setFiltersOpen(false);
  }, [priceRange]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setAppliedPriceRange({ min: "", max: "" });
    setSearchQuery("");
    setSortBy("relevancia");
    setFiltersOpen(false);
  }, []);

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max;

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
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block lg:w-64 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <FiltersContent
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                appliedPriceRange={appliedPriceRange}
                categories={categories}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onApplyPriceFilter={applyPriceFilter}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
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

            {/* Mobile Filters Bar + Sort */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="lg:hidden flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filtros
                        {(selectedCategory ||
                          priceRange.min ||
                          priceRange.max) && (
                          <Badge className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 ml-1">
                            {
                              [
                                selectedCategory,
                                priceRange.min,
                                priceRange.max,
                              ].filter(Boolean).length
                            }
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="p-6 border-b">
                        <SheetTitle className="text-left">Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="p-6 overflow-auto h-[calc(100vh-80px)]">
                        <FiltersContent
                          selectedCategory={selectedCategory}
                          priceRange={priceRange}
                          appliedPriceRange={appliedPriceRange}
                          categories={categories}
                          onCategoryChange={handleCategoryChange}
                          onPriceChange={handlePriceChange}
                          onApplyPriceFilter={applyPriceFilter}
                          onClearFilters={clearFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {data?.pages.map((page) =>
                  page.data.map((product: Product) => (
                    <Link key={product.id} href={`/produto/${product.id}`}>
                      <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={
                              product.images[0]?.url ||
                              "/productCardDefault.png"
                            }
                            alt={product.name}
                            width={300}
                            height={400}
                            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.isNew && (
                              <Badge className="bg-emerald-500 text-white text-xs">
                                Novo
                              </Badge>
                            )}
                            {product.isSale && (
                              <Badge className="bg-red-500 text-white text-xs">
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
                            <span className="text-base sm:text-lg font-bold text-emerald-600">
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
    </div>
  );
}
