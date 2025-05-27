import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="container px-4 py-12 md:px-6">
      <h2 className="text-2xl font-bold mb-6 text-[#3a5a40]">
        Você também pode gostar
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-square relative mb-4">
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-muted-foreground mb-2">
              R$ {product.price?.toFixed(2).replace(".", ",")}
            </p>
            <Link href={`/produto/${product.id}`}>
              <Button variant="outline" className="w-full">
                Ver detalhes
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
