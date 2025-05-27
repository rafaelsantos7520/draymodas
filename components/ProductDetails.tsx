"use client";

import { Button } from "@/components/ui/button";

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
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-[#3a5a40]">
          {name}
        </h1>
        <p className="text-muted-foreground uppercase tracking-wide font-semibold">
          {category?.name}
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Descrição</h2>
        <p className="text-muted-foreground text-base">{description}</p>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Preço</h2>
        <p className="text-2xl font-bold text-[#3a5a40]">
          R$ {price?.toFixed(2).replace(".", ",")}
        </p>
      </div>
      {sizes && sizes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Tamanhos disponíveis</h2>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((item) => (
              <span
                key={item.sizeId}
                className="px-3 py-1 rounded border border-[#3a5a40] text-[#3a5a40] font-medium bg-white shadow-sm"
              >
                {item.size?.name}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="pt-4">
        <a
          href={`https://wa.me/5527997685809?text=Olá! Tenho interesse no produto: ${name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
            Quero este produto
          </Button>
        </a>
        <p className="text-sm text-muted-foreground italic mt-2">
          * Este é apenas um catálogo para visualização. Para informações sobre
          preços e disponibilidade, entre em contato conosco.
        </p>
      </div>
    </div>
  );
}
