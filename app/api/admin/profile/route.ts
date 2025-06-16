import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const token = cookies().get("admin_token")?.value;

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
      id: string;
    };
    const adminId = decoded.id;

    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Erro ao verificar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
