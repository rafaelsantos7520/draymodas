"use client";

import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductCard } from "@/components/ProductCard";
import { ShareButton } from "@/components/ShareButton";
import { ProductWithRelations } from "@/types/product";
import Loading from "./loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProductResponse {
  product: ProductWithRelations;
  relatedProducts: ProductWithRelations[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProdutoPage({ params }: PageProps) {
  const { data, error, isLoading } = useSWR<ProductResponse>(
    `/api/products/${params.id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 900000, // 15 minutos
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full px-4 py-8">
        <div className="container px-4 md:px-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ocorreu um erro ao carregar o produto. Por favor, tente novamente
              mais tarde.
            </AlertDescription>
          </Alert>
          <Link href="/catalogo">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar para o catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;
  const productUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/produto/${params.id}`;

  return (
    <div className="flex flex-col min-h-screen w-full py-4 md:py-8">
      <main className="flex-1">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb e ações */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/catalogo">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar para o catálogo
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <ShareButton
                productName={product.name}
                productUrl={productUrl}
                productImage={product.images[0]?.url}
                productPrice={product.price}
              />
            </div>
          </div>

          {/* Produto principal */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start bg-white rounded-lg shadow-md p-4 md:p-8 mb-8">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
            <ProductDetails
              name={product.name}
              category={product.category}
              description={product.description}
              price={product.price}
              sizes={product.sizes}
            />
          </div>

          {/* Produtos relacionados */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Produtos Relacionados
                </h2>
                <Link href="/catalogo">
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
