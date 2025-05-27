import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔵 Buscando produto no banco de dados: ID ${params.id}`);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: true,
        sizes: { include: { size: true } },
      },
    });

    if (!product) {
      console.log(`⚠️ Produto não encontrado: ID ${params.id}`);
      return new NextResponse("Produto não encontrado", { status: 404 });
    }

    console.log(`🟢 Produto encontrado: ${product.name}`);

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { images: true },
      take: 3,
    });

    console.log(
      `🟣 Produtos relacionados encontrados: ${relatedProducts.length}`
    );

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
