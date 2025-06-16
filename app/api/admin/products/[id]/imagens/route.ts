import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import sharp from "sharp";
import heicConvert from "heic-convert";

type Params = Promise<{ id: string }>;

// Função para converter HEIC para JPEG
async function convertHeicToJpeg(file: File): Promise<Buffer> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    try {
      const jpegBuffer = await heicConvert({
        buffer: buffer,
        format: "JPEG",
        quality: 0.9,
      });
      return jpegBuffer;
    } catch (error) {
      console.error("Erro na conversão HEIC:", error);
      throw new Error("Falha ao converter imagem HEIC");
    }
  }

  return buffer;
}

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

    // Converte HEIC para JPEG se necessário
    const buffer = await convertHeicToJpeg(file);

    // Gera um nome único para o arquivo
    const fileExt =
      file.type === "image/heic" ? "jpg" : file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${id}/${fileName}`;

    // Faz upload para o Supabase
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type === "image/heic" ? "image/jpeg" : file.type,
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
