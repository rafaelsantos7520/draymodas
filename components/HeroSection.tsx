import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative w-full py-10 md:py-24 lg:py-32 bg-gradient-to-br from-[#3a5a40] via-[#4a6b50] to-[#2d4a33] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <Badge className="bg-white/20 text-white border-white/30 w-fit">
              ✨ Nova Coleção Disponível
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Dray <span className="text-emerald-300">Modas</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-[600px] leading-relaxed">
              Descubra nossa coleção exclusiva de moda feminina. Elegância,
              estilo e sofisticação para todas as ocasiões especiais da sua
              vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver Catálogo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/70">Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-white/70">Clientes Felizes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-white/70 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Avaliação
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center relative">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-300 to-blue-300 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Moda Feminina Elegante"
                width={500}
                height={600}
                className="relative rounded-2xl object-cover shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                priority
                quality={85}
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Novo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
