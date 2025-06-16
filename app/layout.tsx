import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CoreProvider } from "@/components/Core-provider";
import NavbarCliente from "@/components/cliente/NavbarCliente";
import { AuthProvider } from "@/app/contexts/AuthContext";
import FooterCliente from "@/components/cliente/FooterCliente";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dray Modas",
  description: "Dray Modas - Moda Feminina",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <NavbarCliente />
          <CoreProvider>{children}</CoreProvider>
        </AuthProvider>
        <FooterCliente />
      </body>
    </html>
  );
}
