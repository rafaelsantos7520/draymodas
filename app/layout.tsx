"use client";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import NavbarCliente from "@/components/cliente/NavbarCliente";
import FooterCliente from "@/components/cliente/FooterCliente";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <AuthProvider>
        <body>
          <NavbarCliente />
          {children}
          <FooterCliente />
        </body>
      </AuthProvider>
    </html>
  );
}
