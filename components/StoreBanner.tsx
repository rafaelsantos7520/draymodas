import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function StoreBanner() {
  return (
    <section className="relative w-full py-16 bg-gradient-to-r from-gray-50 to-pink-50 text-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <Badge className="bg-pink-100 text-pink-700 border-pink-200 w-fit">
            🎉 Bem-vinda à Dray Modas
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Dray <span className="text-pink-600">Modas</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl text-gray-600">
            Descubra nossa coleção exclusiva de moda feminina. Elegância e
            estilo para todas as ocasiões.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/catalogo">
              <Button
                size="lg"
                className="bg-pink-600 text-white hover:bg-pink-700 transition-all duration-300 shadow-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ver Todos os Produtos
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
