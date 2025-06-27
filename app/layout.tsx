import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CoreProvider } from "@/components/Core-provider";
import NavbarCliente from "@/components/cliente/NavbarCliente";
import { AuthProvider } from "@/app/contexts/AuthContext";
import FooterCliente from "@/components/cliente/FooterCliente";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Dray Modas",
  description: "Dray Modas - Moda Feminina",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
          <CoreProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </CoreProvider>
        </AuthProvider>
        <FooterCliente />
      </body>
    </html>
  );
}
