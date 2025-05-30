import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, totalCategories] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      totalProducts,
      totalCategories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard." },
      { status: 500 }
    );
  }
}
