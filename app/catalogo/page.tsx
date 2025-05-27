"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Filter, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingComponent } from "@/components/LoadingComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";

export default function CatalogoPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetTriggerRef = useRef<any>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

  // Cache para produtos
  const productsCache = useRef<Map<string, any[]>>(new Map());

  // Estados para inputs (edição)
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [editPriceRange, setEditPriceRange] = useState({ min: "", max: "" });
  const [editSizes, setEditSizes] = useState<string[]>([]);

  // Estados para filtros aplicados
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState<string | null>(null);
  const [appliedPriceRange, setAppliedPriceRange] = useState({
    min: "",
    max: "",
  });
  const [appliedSizes, setAppliedSizes] = useState<string[]>([]);

  const fetchData = useCallback(
    async (pageNum: number = 1, filters: any = {}) => {
      try {
        const cacheKey = JSON.stringify({ page: pageNum, ...filters });

        if (productsCache.current.has(cacheKey)) {
          const cachedProducts = productsCache.current.get(cacheKey);
          setProducts(cachedProducts || []);
          return;
        }

        const queryParams = new URLSearchParams({
          page: pageNum.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...filters,
        });

        const [productsRes, categoriesRes, sizesRes] = await Promise.all([
          axios.get(`/api/products?${queryParams.toString()}`),
          axios.get("/api/admin/categories"),
          axios.get("/api/admin/sizes"),
        ]);

        // A resposta da API /api/products já retorna o array de produtos diretamente
        const newProducts = productsRes.data || [];
        setProducts(
          pageNum === 1 ? newProducts : [...(products || []), ...newProducts]
        );
        setHasMore(newProducts.length === ITEMS_PER_PAGE);

        // Atualizar cache
        productsCache.current.set(cacheKey, newProducts);

        if (pageNum === 1) {
          setCategories(categoriesRes.data || []);
          setSizes(sizesRes.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [products]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = useCallback(
    async (categoryId: string) => {
      setIsCategoryLoading(true);
      setEditCategory(categoryId);
      setAppliedCategory(categoryId);
      setFilterLoading(true);
      setPage(1);

      try {
        await fetchData(1, { categoryId });
      } catch (error) {
        console.error("Erro ao filtrar por categoria:", error);
      } finally {
        setFilterLoading(false);
        setIsCategoryLoading(false);
      }
    },
    [fetchData]
  );

  const handlePriceInput = (type: "min" | "max", value: string) => {
    setEditPriceRange({
      ...editPriceRange,
      [type]: value,
    });
  };

  const handleSizeChange = (sizeId: string) => {
    setEditSizes((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const handlePriceFilter = useCallback(async () => {
    setFilterLoading(true);
    setPage(1);

    try {
      await fetchData(1, {
        minPrice: editPriceRange.min,
        maxPrice: editPriceRange.max,
        sizeIds: editSizes,
      });

      setAppliedPriceRange({ ...editPriceRange });
      setAppliedSizes([...editSizes]);
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Erro ao filtrar por preço/tamanho:", error);
    } finally {
      setFilterLoading(false);
    }
  }, [editPriceRange, editSizes, fetchData]);

  const handleSearch = useCallback(async () => {
    setSearchLoading(true);
    setPage(1);

    try {
      await fetchData(1, { search: searchQuery });
      setAppliedSearch(searchQuery);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, fetchData]);

  const handleClearFilters = useCallback(async () => {
    setEditCategory(null);
    setEditPriceRange({ min: "", max: "" });
    setEditSizes([]);
    setSearchQuery("");
    setAppliedCategory(null);
    setAppliedPriceRange({ min: "", max: "" });
    setAppliedSizes([]);
    setAppliedSearch("");
    setPage(1);
    setLoading(true);

    try {
      await fetchData(1);
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  // Skeleton para card de produto
  function ProductCardSkeleton() {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white mx-auto w-full max-w-xs">
        <div className="relative aspect-[3/4] md:aspect-[2/3]">
          <Skeleton className="w-full h-full absolute top-0 left-0" />
        </div>
        <div className="p-2 sm:p-3">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
    );
  }

  // Memoize o grid de produtos
  const productGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
        {filterLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        ) : (products || []).length > 0 ? (
          (products || []).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado.
            </p>
          </div>
        )}
      </div>
    ),
    [products, filterLoading]
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <LoadingComponent size="lg" text="Carregando produtos..." />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-4 md:py-12">
          <div className="container px-2 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              <div className="flex-1 min-w-[220px]">
                <h1 className="text-3xl font-bold tracking-tighter text-primary">
                  Catálogo
                </h1>
                <p className="text-muted-foreground">
                  Explore nossa coleção de moda feminina
                </p>
              </div>
              <div className="w-full md:max-w-3xl md:mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 md:gap-4 justify-center mt-4 md:mt-0">
                <div className="w-full sm:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between rounded-xl h-12 text-base"
                        disabled={isCategoryLoading}
                      >
                        {isCategoryLoading ? (
                          <span className="flex items-center justify-center w-full">
                            Carregando...
                          </span>
                        ) : (
                          <>
                            {editCategory
                              ? categories.find((c) => c.id === editCategory)
                                  ?.name
                              : "Todas as categorias"}
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-full">
                      <DropdownMenuRadioGroup value={editCategory || "todos"}>
                        <DropdownMenuRadioItem
                          value="todos"
                          onClick={() => handleCategoryChange("")}
                          disabled={isCategoryLoading}
                        >
                          Todas as categorias
                        </DropdownMenuRadioItem>
                        {categories.map((category) => (
                          <DropdownMenuRadioItem
                            key={category.id}
                            value={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            disabled={isCategoryLoading}
                          >
                            {category.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="relative flex gap-2 w-full sm:w-auto">
                  <Input
                    type="text"
                    placeholder="nome do produto...."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    className="w-full sm:w-[200px] md:w-[300px] rounded-xl h-12 text-base border border-black/20"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-primary text-white shadow-sm hover:bg-[#588157] font-semibold px-6 py-2 text-base w-full max-w-[100px]  rounded-xl h-12"
                    disabled={searchLoading}
                  >
                    {searchLoading ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <div className="w-full sm:w-auto">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="secondary"
                        className="border border-black/20 flex items-center gap-2 w-full justify-center rounded-xl h-12 text-base"
                        ref={sheetTriggerRef}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="max-w-full w-[95vw] px-2">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-6 mt-6">
                        <div>
                          <Label>Tamanhos</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {sizes.map((size) => (
                              <Button
                                key={size.id}
                                variant={
                                  editSizes.includes(size.id)
                                    ? "default"
                                    : "outline"
                                }
                                className="px-3 py-2 text-base rounded-xl"
                                onClick={() => handleSizeChange(size.id)}
                              >
                                {size.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Preço</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              type="number"
                              placeholder="Mínimo"
                              value={editPriceRange.min}
                              onChange={(e) =>
                                handlePriceInput("min", e.target.value)
                              }
                              className="rounded-xl h-12 text-base"
                            />
                            <Input
                              type="number"
                              placeholder="Máximo"
                              value={editPriceRange.max}
                              onChange={(e) =>
                                handlePriceInput("max", e.target.value)
                              }
                              className="rounded-xl h-12 text-base"
                            />
                          </div>
                          <Button
                            className="w-full mt-4 rounded-xl h-12 text-base"
                            onClick={handlePriceFilter}
                            disabled={filterLoading}
                          >
                            {filterLoading ? "Filtrando..." : "Aplicar Filtro"}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
            {(appliedCategory ||
              appliedPriceRange.min ||
              appliedPriceRange.max ||
              appliedSizes.length > 0 ||
              appliedSearch) && (
              <div className="flex flex-wrap gap-2 items-center my-4">
                {appliedSearch && (
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    Busca: {appliedSearch}
                  </span>
                )}
                {appliedCategory && (
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    Categoria:{" "}
                    {categories.find((c) => c.id === appliedCategory)?.name}
                  </span>
                )}
                {appliedSizes.length > 0 && (
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    Tamanhos:{" "}
                    {sizes
                      .filter((s) => appliedSizes.includes(s.id))
                      .map((s) => s.name)
                      .join(", ")}
                  </span>
                )}
                {appliedPriceRange.min && (
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    Mín: R$ {appliedPriceRange.min}
                  </span>
                )}
                {appliedPriceRange.max && (
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    Máx: R$ {appliedPriceRange.max}
                  </span>
                )}
                <Button
                  size="sm"
                  className="bg-red-100 text-red-700 hover:bg-red-200 font-semibold flex items-center gap-1 px-3 py-2 w-full sm:w-auto rounded-xl h-12 text-base"
                  onClick={handleClearFilters}
                >
                  <X className="w-4 h-4" /> Limpar filtros
                </Button>
              </div>
            )}
            {productGrid}

            {hasMore && !filterLoading && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchData(nextPage);
                  }}
                  className="bg-primary text-white"
                >
                  Carregar mais
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
