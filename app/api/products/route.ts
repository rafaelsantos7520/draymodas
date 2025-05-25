import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const sizeIds = searchParams.getAll("sizeId");

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (minPrice)
    where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
  if (maxPrice)
    where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
  if (search) where.name = { contains: search, mode: "insensitive" };

  // Filtro por tamanho
  let products;
  if (sizeIds && sizeIds.length > 0) {
    products = await prisma.product.findMany({
      where: {
        ...where,
        sizes: {
          some: {
            sizeId: { in: sizeIds },
          },
        },
      },
      include: {
        category: true,
        images: true,
        sizes: {
          include: {
            size: true,
          },
        },
      },
    });
  } else {
    products = await prisma.product.findMany({
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
    });
  }
  return NextResponse.json(products);
}
