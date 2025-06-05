import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function PUT(request: Request, segementData: { params: Params }) {
  const params = await segementData.params;
  const id = params.id;

  try {
    const formData = await request.formData();

    const adminId = formData.get("adminId") as string;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin não encontrado" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const categoryId = formData.get("category") as string;

    if (!categoryId) {
      return NextResponse.json(
        { error: "É necessário selecionar uma categoria" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    const sizesString = formData.get("sizes") as string;
    const sizeIds = JSON.parse(sizesString);

    if (!Array.isArray(sizeIds) || sizeIds.length === 0) {
      return NextResponse.json(
        { error: "É necessário selecionar pelo menos um tamanho" },
        { status: 400 }
      );
    }

    const sizes = await prisma.size.findMany({
      where: { id: { in: sizeIds } },
    });

    if (sizes.length !== sizeIds.length) {
      return NextResponse.json(
        { error: "Um ou mais tamanhos não foram encontrados" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        categoryId: categoryId,
        isActive: formData.get("isActive") === "true",
        isReady: formData.get("isReady") === "true",
        isFeatured: formData.get("isFeatured") === "true",
        sizes: {
          deleteMany: {},
          create: sizeIds.map((id) => ({
            size: { connect: { id } },
          })),
        },
      },
      include: {
        category: true,
        sizes: { include: { size: true } },
        images: true,
      },
    });

    return NextResponse.json({
      message: "Produto atualizado com sucesso",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request, segementData: { params: Params }) {
  const params = await segementData.params;
    const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  return NextResponse.json(product);
}
