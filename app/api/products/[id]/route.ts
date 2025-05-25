import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const { id } = await segmentData.params;

  // Buscar o produto principal
  const product = await prisma.product.findUnique({
    where: { id: id },
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

  // Buscar produtos da mesma categoria (excluindo o produto atual)
  let relatedProducts: any[] = [];
  if (product && product.categoryId) {
    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id },
      },
      include: {
        category: true,
        images: true,
        sizes: {
          include: {
            size: true,
          },
        },
      },
      take: 5, // Limite de produtos relacionados
    });
  }

  return NextResponse.json({ product, relatedProducts });
}
