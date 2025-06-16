import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


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
    });

    return NextResponse.json(
      { product, relatedProducts },
    );
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

