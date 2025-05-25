"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { LoadingComponent } from "@/components/LoadingComponent";
export default function ProdutoPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent text="Carregando produto..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">
            Produto não encontrado.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <Image
              src={product.images?.[selectedIndex]?.url || "/placeholder.svg"}
              alt={`${product.name} - Imagem ampliada`}
              width={700}
              height={900}
              className="rounded-lg object-contain max-h-[80vh] max-w-[90vw] bg-white"
            />
          </div>
        </div>
      )}
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
            <div className="space-y-4 flex flex-col items-center">
              <div
                className="relative overflow-hidden rounded-lg flex justify-center items-center bg-gray-50 cursor-pointer"
                style={{ maxHeight: 500, maxWidth: 400, width: "100%" }}
                onClick={() => setModalOpen(true)}
              >
                <Image
                  src={
                    product.images?.[selectedIndex]?.url || "/placeholder.svg"
                  }
                  alt={`${product.name} - Imagem ${selectedIndex + 1}`}
                  width={400}
                  height={500}
                  className="rounded-lg object-contain w-full h-[400px]"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 justify-center mt-2">
                  {product.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`border rounded-md p-1 transition-all ${
                        selectedIndex === idx
                          ? "border-[#3a5a40] ring-2 ring-[#3a5a40]"
                          : "border-gray-200"
                      }`}
                      style={{ background: "#fff" }}
                    >
                      <Image
                        src={img.url || "/placeholder.svg"}
                        alt={`Miniatura ${idx + 1}`}
                        width={60}
                        height={60}
                        className="object-contain rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-[#3a5a40]">
                  {product.name}
                </h1>
                <p className="text-muted-foreground uppercase tracking-wide font-semibold">
                  {product.category?.name}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Descrição</h2>
                <p className="text-muted-foreground text-base">
                  {product.description}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Preço</h2>
                <p className="text-2xl font-bold text-[#3a5a40]">
                  R$ {product.price?.toFixed(2).replace(".", ",")}
                </p>
              </div>
              {product.sizes?.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    Tamanhos disponíveis
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((item: any) => (
                      <span
                        key={item.sizeId}
                        className="px-3 py-1 rounded border border-[#3a5a40] text-[#3a5a40] font-medium bg-white shadow-sm"
                      >
                        {item.size?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-4">
                <a
                  href={`https://wa.me/5527997685809?text=Olá! Tenho interesse no produto: ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                  Quero este produto
                </Button>
                </a>
                <p className="text-sm text-muted-foreground italic mt-2">
                  * Este é apenas um catálogo para visualização. Para
                  informações sobre preços e disponibilidade, entre em contato
                  conosco.
                </p>
              </div>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="container px-4 py-12 md:px-6">
            <h2 className="text-2xl font-bold mb-6 text-[#3a5a40]">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={
                        relatedProduct.images?.[0]?.url || "/placeholder.svg"
                      }
                      alt={relatedProduct.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    R$ {relatedProduct.price?.toFixed(2).replace(".", ",")}
                  </p>
                  <Link href={`/produto/${relatedProduct.id}`}>
                    <Button variant="outline" className="w-full">
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
