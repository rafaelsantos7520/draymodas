import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroBanner() {
  return (
    <section className="relative w-full py-12 bg-gradient-to-r from-green-100 via-green-50 to-green-200 text-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Badge className="bg-green-100 text-green-700 border-green-200 w-fit">
            🎉 Nova Coleção
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Dray <span className="text-brand-primary">Modas</span>
          </h1>
          <p className="text-base leading-relaxed max-w-xl text-gray-600">
            Descubra nossa coleção exclusiva de moda feminina. Elegância e
            estilo para todas as ocasiões.
          </p>
          <Link href="/catalogo">
            <Button
              size="lg"
              className="bg-brand-primary text-white hover:bg-brand-primary-dark transition-all duration-300 shadow-lg"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Ver Produtos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
