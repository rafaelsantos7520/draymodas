import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;


export async function GET() {
  try {
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

    const response = NextResponse.json(products);

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    response.headers.set("CDN-Cache-Control", "public, s-maxage=3600");
    response.headers.set("Vercel-CDN-Cache-Control", "public, s-maxage=3600");

    return response;
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos em destaque" },
      { status: 500 }
    );
  }
}
