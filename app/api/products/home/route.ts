import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos em destaque" },
      { status: 500 }
    );
  }
}
