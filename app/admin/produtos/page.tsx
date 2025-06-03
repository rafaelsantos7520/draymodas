"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/admin/ProductListTable";
import Link from "next/link";
import type {
  Product,
  Category,
  Size,
  ProductSize,
  Image,
} from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";

type ProductWithRelations = Product & {
  category: Category;
  images: Image[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};

export default function Page() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("/api/admin/products");
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

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
