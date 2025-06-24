"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images: { url: string }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4 flex flex-col items-center">
        <div className="relative overflow-hidden rounded-lg flex justify-center items-center bg-gray-50 w-full max-w-md h-[400px]">
          <Image
            src="/productCardDefault.png"
            alt={`${productName} - Imagem padrão`}
            fill
            className="rounded-lg object-contain"
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white z-10"
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </Button>
            <Image
              src={images[selectedIndex]?.url || "/productCardDefault.png"}
              alt={`${productName} - Imagem ampliada`}
              width={800}
              height={1000}
              className="rounded-lg object-contain max-h-[80vh] max-w-[90vw] bg-white"
              quality={90}
              priority
            />
          </div>
        </div>
      )}

      <div className="space-y-4 flex flex-col items-center">
        {/* Imagem principal */}
        <div className="relative group w-full max-w-md h-[400px]">
          <div
            className="relative overflow-hidden rounded-lg flex justify-center items-center bg-gray-50 cursor-pointer w-full h-full"
            onClick={() => setModalOpen(true)}
          >
            <Image
              src={images[selectedIndex]?.url || "/productCardDefault.png"}
              alt={`${productName} - Imagem ${selectedIndex + 1}`}
              fill
              className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
              quality={85}
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-2 justify-center mt-2 flex-wrap">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`border-2 rounded-md p-1 transition-all hover:scale-105 ${
                  selectedIndex === idx
                    ? "border-brand-primary ring-2 ring-brand-primary/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ background: "#fff" }}
              >
                <Image
                  src={img.url || "/productCardDefault.png"}
                  alt={`Miniatura ${idx + 1}`}
                  width={60}
                  height={60}
                  className="object-contain rounded w-12 h-12"
                  quality={75}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
