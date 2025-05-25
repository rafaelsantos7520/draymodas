import { NewProductForm } from "@/components/admin/NewProductForm";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const categories = await prisma.category.findMany();
  const sizes = await prisma.size.findMany();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Criar Produto</h1>
      <div className="flex flex-col gap-4">
        <NewProductForm categories={categories} sizes={sizes} />
      </div>
    </div>
  );
}
