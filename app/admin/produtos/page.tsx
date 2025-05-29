import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/admin/ProductListTable";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type {
  Product,
  Category,
  Size,
  ProductSize,
  Image,
} from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  images: Image[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};

export default async function Page() {
  const products = (await prisma.product.findMany({
    include: {
      category: true,
      sizes: {
        include: {
          size: true,
        },
      },
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as ProductWithRelations[];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <Link href="/admin/produtos/criar" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        </div>
        <ProductList products={products} />
      </div>
    </div>
  );
}
