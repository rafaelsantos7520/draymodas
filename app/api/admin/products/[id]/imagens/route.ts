import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segementData: { params: Params }) {
  const params = await segementData.params;
  const id = params.id;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request, segementData: { params: Params }) {
  const params = await segementData.params;
  const id = params.id;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Gera um nome único para o arquivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${id}/${fileName}`;

    // Converte o arquivo para ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Faz upload para o Supabase
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Erro no upload:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Obtém a URL pública da imagem
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    // Cria o registro da imagem no banco de dados
    const newImage = await prisma.image.create({
      data: {
        url: publicUrl,
        productId: id,
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar a imagem" },
      { status: 500 }
    );
  }
}
