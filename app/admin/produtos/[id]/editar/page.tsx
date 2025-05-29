import { EditProductForm } from "@/components/admin/EditProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Product, Category, Size, ProductSize } from "@prisma/client";

type Params = Promise<{ id: string }>;

type ProductWithRelations = Product & {
  sizes: (ProductSize & {
    size: Size;
  })[];
};

export default async function Page(props: { params: Params }) {
  const params = await props.params;

  const [product, categories, sizes] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        sizes: {
          include: {
            size: true,
          },
        },
      },
    }),
    prisma.category.findMany(),
    prisma.size.findMany(),
  ]);

  if (!product) {
    notFound();
  }

  return (
      <div className="container mx-auto px-2 py-6">
        <div className="flex flex-col gap-4">
        <EditProductForm
          product={product as ProductWithRelations}
          categories={categories}
          sizes={sizes}
        />
      </div>
    </div>
  );
}
