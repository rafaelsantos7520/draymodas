import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // 1 hora de cache

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: true,
        sizes: { include: { size: true } },
      },
      cacheStrategy: {
        ttl: 1000 * 60 * 10,
        swr: 1000 * 60 * 10,
      },
    });

    if (!product) {
      return new NextResponse("Produto não encontrado", { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { images: true },
      take: 3,
      cacheStrategy: {
        ttl: 1000 * 60 * 10,
        swr: 1000 * 60 * 10,
      },
    });

    return NextResponse.json(
      { product, relatedProducts },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
