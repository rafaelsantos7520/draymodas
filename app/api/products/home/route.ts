import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Cache em memória para produtos em destaque
let cachedProducts: any = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

export async function GET() {
  try {
    const headersList = headers();
    const now = Date.now();

    // Verifica se o cache ainda é válido
    if (cachedProducts && now - lastFetch < CACHE_DURATION) {
      return NextResponse.json(cachedProducts, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
        },
      });
    }

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
    });

    // Formata os produtos para a resposta
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      images: product.images,
      category: product.category,
    }));

    // Atualiza o cache
    cachedProducts = formattedProducts;
    lastFetch = now;

    return NextResponse.json(formattedProducts, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos em destaque" },
      { status: 500 }
    );
  }
}
