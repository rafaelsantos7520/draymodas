import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/admin/ProductListTable";
import Link from "next/link";
import { getProducts } from "@/lib/services/product.service";



export default async function Page() {
  const products = await getProducts(100);

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <Link href="/admin/produtos/criar" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-brand-primary text-white hover:bg-brand-primary/90">
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
