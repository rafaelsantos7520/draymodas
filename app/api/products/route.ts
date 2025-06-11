import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const sizeIds = searchParams.getAll("sizeId");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "50");

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (minPrice)
      where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
    if (maxPrice)
      where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
    if (search) where.name = { contains: search, mode: "insensitive" };

    if (sizeIds && sizeIds.length > 0) {
      where.sizes = {
        some: {
          sizeId: { in: sizeIds },
        },
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "menor-preco") orderBy = { price: "asc" };
    if (sort === "maior-preco") orderBy = { price: "desc" };

    const skip = (page - 1) * perPage;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          sizes: {
            include: {
              size: true,
            },
          },
        },
        skip,
        take: perPage,
        orderBy,
      }),
    ]);

    return NextResponse.json({
      data: products,
      meta: {
        total,
        currentPage: page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        hasNextPage: page < Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
