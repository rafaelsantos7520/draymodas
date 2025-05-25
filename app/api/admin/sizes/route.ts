import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sizes = await prisma.size.findMany();
  return NextResponse.json(sizes);
}

