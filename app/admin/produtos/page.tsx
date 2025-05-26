import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductListTable } from "@/components/admin/ProductListTable";
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/admin/produtos/criar">
          <Button>
            <Plus />
            Novo Produto
          </Button>
        </Link>
      </div>
      <ProductListTable products={products} />
    </div>
  );
}
