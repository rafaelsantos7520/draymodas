export const revalidate = 86400; // 24 horas

  import Link from "next/link";
  import { ChevronLeft } from "lucide-react";
  import { Button } from "@/components/ui/button";

  import { getProductWithRelated } from "@/lib/services/product.service";
  import { notFound } from "next/navigation";
  import { ProductGallery } from "@/components/ProductGallery";
  import { ProductDetails } from "@/components/ProductDetails";
  import { ProductCard } from "@/components/ProductCard";

  interface PageProps {
    params: {
      id: string;
    };
  }

  export default async function ProdutoPage({ params }: PageProps) {
    const data = await getProductWithRelated(params.id);

    if (!data) {
      notFound();
    }

    const { product, relatedProducts } = data;

    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container px-4 py-12 md:px-6">
            <div className="mb-6">
              <Link href="/catalogo">
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar para o catálogo
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start bg-white rounded-lg shadow-md p-4 md:p-8">
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
          </div>
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Produtos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
