import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString();
}

function formatProduct(product: any) {
  return {
    ...product,
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
    category: product.category
      ? {
          ...product.category,
          createdAt: formatDate(product.category.createdAt),
          updatedAt: formatDate(product.category.updatedAt),
        }
      : null,
    images:
      product.images?.map((image: any) => ({
        ...image,
        createdAt: formatDate(image.createdAt),
        updatedAt: formatDate(image.updatedAt),
      })) || [],
    sizes:
      product.sizes?.map((size: any) => ({
        ...size,
        createdAt: formatDate(size.createdAt),
        updatedAt: formatDate(size.updatedAt),
        size: size.size
          ? {
              ...size.size,
              createdAt: formatDate(size.size.createdAt),
              updatedAt: formatDate(size.size.updatedAt),
            }
          : null,
      })) || [],
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
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

  return product ? formatProduct(product) : null;
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(formatProduct);
}

export async function getProductsByCategory(categoryId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  return products.map(formatProduct);
}

export async function getProductWithRelated(id: string) {
  const product = await getProductById(id);

  if (!product) return null;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
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
    take: 3,
  });

  return {
    product,
    relatedProducts: relatedProducts.map(formatProduct),
  };
}

export async function getProductFeatured() {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(formatProduct);
}
