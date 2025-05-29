import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Lista de rotas que precisam de autenticação
  const protectedRoutes = [
    "/api/admin/profile",
    "/api/admin/produtos",
    // Adicione outras rotas protegidas aqui
  ];

  // Verifica se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 }
      );
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado");
      }

      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/admin/:path*",
};
