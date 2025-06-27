import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductCard } from "@/components/ProductCard";
import { ShareButton } from "@/components/ShareButton";

interface PageProps {
  params: {
    id: string;
  };
}

export const revalidate = 3600; // cache por 1 hora

export default async function ProdutoPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: true,
      sizes: true,
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
  });

  return (
    <div>
      {/* Renderize seu JSX aqui usando os dados carregados */}
      <ProductGallery images={product.images} productName={product.name} />
      <ProductDetails
        name={product.name}
        category={product.category}
        description={product.description}
        price={product.price}
        sizes={product.sizes as any}
      />
      {/* produtos relacionados */}
      <div>
        {relatedProducts.map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
      <ShareButton
        productName={product.name}
        productUrl={`/produto/${params.id}`}
        productImage={product.images[0]?.url}
        productPrice={product.price}
      />
    </div>
  );
}
