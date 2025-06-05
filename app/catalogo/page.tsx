"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingComponent } from "@/components/LoadingComponent";
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

const ITEMS_PER_PAGE = 10;

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("relevancia");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const productsCache = useRef<Map<string, Product[]>>(new Map());

  const buildFilters = useCallback(() => {
    const filters: Record<string, string> = {
      limit: ITEMS_PER_PAGE.toString(),
    };
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (priceRange.min) filters.minPrice = priceRange.min;
    if (priceRange.max) filters.maxPrice = priceRange.max;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    if (sortBy !== "relevancia") filters.sort = sortBy;
    return filters;
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  const fetchProducts = useCallback(
    async (pageNum = 1, resetProducts = true) => {
      try {
        const filters = { ...buildFilters(), page: pageNum.toString() };
        const cacheKey = JSON.stringify(filters);
        if (productsCache.current.has(cacheKey)) {
          const cachedProducts = productsCache.current.get(cacheKey)!;
          if (resetProducts) {
            setProducts(cachedProducts);
          } else {
            setProducts((prev) => [...prev, ...cachedProducts]);
          }
          setHasMore(cachedProducts.length === ITEMS_PER_PAGE);
          return;
        }
        const queryParams = new URLSearchParams(filters);
        const response = await axios.get(`/api/products?${queryParams}`);
        const newProducts = response.data || [];
        productsCache.current.set(cacheKey, newProducts);
        if (resetProducts) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        setHasMore(newProducts.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        if (resetProducts) setProducts([]);
        setHasMore(false);
      }
    },
    [buildFilters]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("/api/admin/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }, []);

  const debouncedSearch = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProducts(1, true);
    }, 500);
  }, [fetchProducts]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
    setFiltersOpen(false); // Fecha o drawer no mobile após selecionar
  }, []);

  const handlePriceChange = useCallback(
    (type: "min" | "max", value: string) => {
      setPriceRange((prev) => ({ ...prev, [type]: value }));
    },
    []
  );

  const applyPriceFilter = useCallback(() => {
    setPage(1);
    fetchProducts(1, true);
    setFiltersOpen(false); // Fecha o drawer no mobile após aplicar
  }, [fetchProducts]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
    setSortBy("relevancia");
    setPage(1);
    setFiltersOpen(false);
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    await fetchProducts(nextPage, false);
    setPage(nextPage);
    setIsLoadingMore(false);
  }, [page, hasMore, isLoadingMore, fetchProducts]);

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max;

  // Componente dos filtros para reutilizar
  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categorias */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Categorias</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange("")}
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
              onClick={() => handleCategoryChange(category.id)}
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
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </div>
          <Button
            onClick={applyPriceFilter}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Aplicar Filtro
          </Button>
        </div>
      </div>

      {/* Limpar Filtros */}
      {(selectedCategory || priceRange.min || priceRange.max) && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts(1, true)]);
      setLoading(false);
    };
    initializeData();
  }, []);

  useEffect(() => {
    debouncedSearch();
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [selectedCategory, sortBy, priceRange.min, priceRange.max]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <main className="flex-1 flex items-center justify-center">
          <LoadingComponent size="lg" text="Carregando produtos..." />
        </main>
      </div>
    );
  }

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
            {/* Search Desktop */}

            {/* Other Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <FiltersContent />
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
                        <FiltersContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="text-gray-600 text-sm">
                    {products.length} produtos encontrados
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

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/produto/${product.id}`}>
                  <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={
                          product.images[0]?.url || "/productCardDefault.png"
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
                            {product.originalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8 md:mt-12">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  size="lg"
                  className="px-6 md:px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isLoadingMore ? "Carregando..." : "Carregar Mais Produtos"}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
