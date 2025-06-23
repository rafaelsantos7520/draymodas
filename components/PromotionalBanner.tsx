import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Percent } from "lucide-react";

export function PromotionalBanner() {
  return (
    <section className="w-full py-8 bg-gradient-to-r from-pink-500 to-pink-200 text-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Percent className="h-8 w-8 text-pink-500" />
              <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                Oferta Especial
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Até 50% de Desconto
              </h3>
              <p className="text-sm text-gray-600">
                Em toda a coleção de verão
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Aproveite enquanto dura!
            </span>
            <Link href="/catalogo">
              <Button
                variant="outline"
                className="bg-white text-pink-600 hover:bg-pink-50 border-pink-200"
              >
                Ver Ofertas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
