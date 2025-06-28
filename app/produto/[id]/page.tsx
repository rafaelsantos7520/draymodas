import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductCard } from "@/components/ProductCard";
import { ShareButton } from "@/components/ShareButton";
import { ProductWithRelations } from "@/types/product";
import { getProductWithRelated } from "@/lib/services/product.service";


interface PageProps {
  params: {
    id: string;
  };
}

export const revalidate = 3600;
export default async function ProdutoPage({ params }: PageProps) {
  const response = await getProductWithRelated(params.id);
  const product = response?.product;
  const relatedProducts = response?.relatedProducts;

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
                productUrl={`/produto/${product.id}`}
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
          {relatedProducts && relatedProducts.length > 0 && (
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
