import { prisma } from "@/lib/prisma";

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      sizes: {
        include: {
          size: true,
        },
      },
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
  });
}

export async function getProductsByCategory(categoryId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
      images: true,
    },
  });
}

export async function getProductWithRelated(id: string) {
  const product = await getProductById(id);

  if (!product) return null;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      images: true,
    },
    take: 3,
  });

  return {
    product,
    relatedProducts,
  };
}

export async function getProductFeatured() {
  return prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    include: {
      category: true,
      images: true,
    },
  });
}
