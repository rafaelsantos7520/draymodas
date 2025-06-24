import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
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
          select: {
            url: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        sizes: {
          include: {
            size: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return new NextResponse("Produto não encontrado", { status: 404 });
    }

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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 4, // Limitar a 4 produtos relacionados
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
