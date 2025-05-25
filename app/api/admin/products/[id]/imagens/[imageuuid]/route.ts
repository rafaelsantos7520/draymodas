import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string; imageuuid: string }>;

export async function DELETE(
  request: Request,
  segementData: { params: Params }
) {
  const params = await segementData.params;
  const imageUuid = params.imageuuid;

  try {
    const image = await prisma.image.findUnique({
      where: {
        id: imageUuid,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não encontrada" },
        { status: 404 }
      );
    }
    const imageUrl = image.url;
    const imagePath = imageUrl.split("/products/").pop() || "";
    console.log("Caminho da imagem:", imagePath);

    const { data, error } = await supabase.storage
      .from("products")
      .remove([imagePath]);
    console.log(imageUrl);

    if (error) {
      console.error("Erro ao deletar imagem:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await prisma.image.delete({
      where: {
        id: imageUuid,
      },
    });

    return NextResponse.json(
      { message: "Imagem deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
