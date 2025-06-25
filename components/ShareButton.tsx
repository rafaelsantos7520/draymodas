"use client";

import { useState } from "react";
import { Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ShareButtonProps {
  productName: string;
  productUrl: string;
  productImage?: string;
  productPrice?: number;
}

export function ShareButton({
  productName,
  productUrl,
  productImage,
  productPrice,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    title: productName,
    text: `Confira este produto incrível: ${productName}${
      productPrice ? ` - R$ ${productPrice.toFixed(2)}` : ""
    }`,
    url: productUrl,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para copiar link
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast.error("Erro ao copiar link");
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={handleNativeShare}
          className="cursor-pointer"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copiar link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
