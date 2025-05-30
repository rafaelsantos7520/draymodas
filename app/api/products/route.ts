import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const sizeIds = searchParams.getAll("sizeId"); // pode ser múltiplo
  const sort = searchParams.get("sort"); // "menor-preco" | "maior-preco" | null
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  // Monta o filtro principal
  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (minPrice)
    where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
  if (maxPrice)
    where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
  if (search) where.name = { contains: search, mode: "insensitive" };

  // Filtro por tamanho (sizeId)
  if (sizeIds && sizeIds.length > 0) {
    where.sizes = {
      some: {
        sizeId: { in: sizeIds },
      },
    };
  }

  // Ordenação
  let orderBy: any = { createdAt: "desc" };
  if (sort === "menor-preco") orderBy = { price: "asc" };
  if (sort === "maior-preco") orderBy = { price: "desc" };

  // Paginação
  const skip = (page - 1) * limit;

  // Busca produtos
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
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

  // Retorno enxuto para catálogo
  return NextResponse.json(products);
}
