import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        sizes: {
          include: {
            size: {
              select: {
                name: true,
              },
            },
          },
        },
        images: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Verifica se o admin existe
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

    // Recebe as categorias como array de IDs
    const categoriesString = formData.get("categories") as string;
    const categoryIds = JSON.parse(categoriesString);

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: "É necessário selecionar pelo menos uma categoria" },
        { status: 400 }
      );
    }

    // Verifica se todas as categorias existem
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: "Uma ou mais categorias não foram encontradas" },
        { status: 404 }
      );
    }

    // Recebe os tamanhos como array de IDs
    const sizesString = formData.get("sizes") as string;
    const sizeIds = JSON.parse(sizesString);

    if (!Array.isArray(sizeIds) || sizeIds.length === 0) {
      return NextResponse.json(
        { error: "É necessário selecionar pelo menos um tamanho" },
        { status: 400 }
      );
    }

    // Verifica se todos os tamanhos existem
    const sizes = await prisma.size.findMany({
      where: { id: { in: sizeIds } },
    });

    if (sizes.length !== sizeIds.length) {
      return NextResponse.json(
        { error: "Um ou mais tamanhos não foram encontrados" },
        { status: 404 }
      );
    }

    // Cria o produto com a primeira categoria
    const product = await prisma.product.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        adminId: adminId,
        categoryId: categoryIds[0],
        sizes: {
          create: sizeIds.map((id) => ({
            size: {
              connect: { id },
            },
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Produto criado com sucesso",
      data: product,
    });
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
