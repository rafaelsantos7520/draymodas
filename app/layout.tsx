"use client";

import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import NavbarCliente from "@/components/cliente/NavbarCliente";
import FooterCliente from "@/components/cliente/FooterCliente";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-gray-50">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        <ToastContainer />

          <AuthProvider>
            <NavbarCliente />
            <main className="flex min-h-screen mx-auto w-full">{children}</main>
            <FooterCliente />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
