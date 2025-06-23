import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany();
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          images: true,
        },
      },
    },
  });
}
