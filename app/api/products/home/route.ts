import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const productFeatured = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
  
    include: {
      images: true,
      category: true,
    },
  });

  return NextResponse.json(productFeatured);
}
