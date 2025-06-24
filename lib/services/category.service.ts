import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          isActive: true,
        },
        include: {
          images: {
            take: 1,
            select: {
              url: true,
            },
          },
        },
      },
    },
  });
}
