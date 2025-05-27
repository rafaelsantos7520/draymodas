"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface ProductGalleryProps {
  images: { url: string }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <Image
              src={images?.[selectedIndex]?.url || "/placeholder.svg"}
              alt={`${productName} - Imagem ampliada`}
              width={700}
              height={900}
              className="rounded-lg object-contain max-h-[80vh] max-w-[90vw] bg-white"
            />
          </div>
        </div>
      )}
      <div className="space-y-4 flex flex-col items-center">
        <div
          className="relative overflow-hidden rounded-lg flex justify-center items-center bg-gray-50 cursor-pointer"
          style={{ maxHeight: 500, maxWidth: 400, width: "100%" }}
          onClick={() => setModalOpen(true)}
        >
          <Image
            src={images?.[selectedIndex]?.url || "/placeholder.svg"}
            alt={`${productName} - Imagem ${selectedIndex + 1}`}
            width={400}
            height={500}
            className="rounded-lg object-contain w-full h-[400px]"
          />
        </div>
        {images?.length > 1 && (
          <div className="flex gap-2 justify-center mt-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`border rounded-md p-1 transition-all ${
                  selectedIndex === idx
                    ? "border-[#3a5a40] ring-2 ring-[#3a5a40]"
                    : "border-gray-200"
                }`}
                style={{ background: "#fff" }}
              >
                <Image
                  src={img.url || "/placeholder.svg"}
                  alt={`Miniatura ${idx + 1}`}
                  width={60}
                  height={60}
                  className="object-contain rounded"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
