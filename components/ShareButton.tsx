"use client";

import { useState } from "react";
import {
  Share2,
  Instagram,
  MessageCircle,
  Facebook,
  Twitter,
  Copy,
  Send,
} from "lucide-react";
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

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareData.text}\n\n${productUrl}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Abrindo WhatsApp...");
  };

  const handleInstagramShare = () => {
    // Instagram não permite compartilhamento direto via URL
    // Vamos copiar o link e mostrar instruções
    handleCopyLink();
    toast.info("Link copiado! Cole no Instagram para compartilhar");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
    toast.success("Abrindo Facebook...");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareData.text);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
      productUrl
    )}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
    toast.success("Abrindo Twitter...");
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`${shareData.text}\n\n${productUrl}`);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      productUrl
    )}&text=${encodeURIComponent(shareData.text)}`;
    window.open(telegramUrl, "_blank");
    toast.success("Abrindo Telegram...");
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

        <DropdownMenuItem
          onClick={handleWhatsAppShare}
          className="cursor-pointer"
        >
          <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleTelegramShare}
          className="cursor-pointer"
        >
          <Send className="mr-2 h-4 w-4 text-blue-500" />
          Telegram
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleInstagramShare}
          className="cursor-pointer"
        >
          <Instagram className="mr-2 h-4 w-4 text-pink-600" />
          Instagram
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleFacebookShare}
          className="cursor-pointer"
        >
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleTwitterShare}
          className="cursor-pointer"
        >
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copiar link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
