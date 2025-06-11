import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {
  try {

    // Busca produtos do banco de dados
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
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
            name: true,
          },
        },
      },
      take: 12,
      orderBy: {
        createdAt: "desc",
      },
      cacheStrategy: {
        // dez minutos
        ttl: 1000 * 60 * 10,  
        swr: 1000 * 60 * 10,  
      },
    });

    // Formata os produtos para a resposta
    // const formattedProducts = products.map((product: any) => ({
    //   id: product.id,
    //   name: product.name,
    //   images: product.images,
    //   category: product.category,
    // }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos em destaque" },
      { status: 500 }
    );
  }
}
