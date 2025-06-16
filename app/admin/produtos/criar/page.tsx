import { NewProductForm } from "@/components/admin/NewProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  const categories = await prisma.category.findMany();
  const sizes = await prisma.size.findMany();

  return (
    <div className="container mx-auto px-2 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Criar Produto
        </h1>
        <div className="flex w-full md:max-w-2xl justify-center">
          <NewProductForm categories={categories} sizes={sizes} />
        </div>
      </div>
    </div>
  );
}
