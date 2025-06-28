"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Shield, Clock } from "lucide-react";

interface ProductDetailsProps {
  name: string;
  category?: { name: string };
  description?: string;
  price: number;
  sizes?: { sizeId: string; size: { name: string } }[];
}

export function ProductDetails({
  name,
  category,
  description,
  price,
  sizes,
}: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho do produto */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {category?.name}
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          {name}
        </h1>
      </div>

      {/* Preço */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Preço</h2>
        <p className="text-3xl font-bold text-brand-primary">
          R$ {price?.toFixed(2).replace(".", ",")}
        </p>
        <p className="text-sm text-gray-500">
          Preço pode variar conforme disponibilidade
        </p>
      </div>

      {/* Descrição */}
      {description && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Descrição</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Tamanhos */}
      {sizes && sizes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Tamanhos disponíveis
          </h2>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((item) => (
              <Badge
                key={item.sizeId}
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
              >
                {item.size?.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Informações de entrega */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Informações de Entrega</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="h-4 w-4 text-brand-primary" />
            <span>Entrega em 2-5 dias úteis</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-brand-primary" />
            <span>Compra 100% segura</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-brand-primary" />
            <span>Atendimento 24/7</span>
          </div>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="space-y-3">
        <a
          href={`https://wa.me/5527997685809?text=Olá! Tenho interesse no produto: ${name} - R$ ${price
            ?.toFixed(2)
            .replace(".", ",")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block"
        >
          <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            Quero este produto
          </Button>
        </a>
        <p className="text-xs text-gray-500 text-center">
          * Este é apenas um catálogo para visualização. Para informações sobre
          preços e disponibilidade, entre em contato conosco via WhatsApp.
        </p>
      </div>
    </div>
  );
}
