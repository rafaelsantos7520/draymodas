"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NavbarCliente() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-primary backdrop-blur-lg text-white shadow-lg">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold">D`ray Modas</span>
          </Link>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Início
          </Link>
          <Link
            href="/catalogo"
            className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/sobre"
            className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="/contato"
            className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Contato
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
          >
            Admin
          </Link>
        </nav>

        {/* Botão Menu Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-primary-foreground/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </Button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-lg border-t border-primary-foreground/10">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/catalogo"
              className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="/sobre"
              className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-lg font-medium hover:text-primary-foreground/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
