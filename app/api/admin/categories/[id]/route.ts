import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se existem produtos na categoria
    const categoryWithProducts = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!categoryWithProducts) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    if (categoryWithProducts._count.products > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir uma categoria que possui produtos" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { error: "Erro ao excluir categoria" },
      { status: 500 }
    );
  }
}
