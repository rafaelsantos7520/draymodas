"use client";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import axios from "axios";
type Params = Promise<{ id: string }>;

type PreviewImage = {
  id: string;
  url: string;
  file: File;
};

export default function ProductImagesPage(props: { params: Params }) {
  const params = use(props.params);
  const productId = params.id;
  const router = useRouter();
  const { toast } = useToast();

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Busca imagens do produto
  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/products/${productId}/imagens`);
        const data = res.data;
        setImages(data.images || []);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as imagens do produto.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [productId, toast]);

  // Remover imagem
  async function handleRemove(imageId: string) {
    setLoading(true);
    try {
      const res = await axios.delete(
        `/api/admin/products/${productId}/imagens/${imageId}`
      );

      if (res.status !== 200) {
        throw new Error("Erro ao remover imagem");
      }

      setImages((imgs) => imgs.filter((img) => img.id !== imageId));
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a imagem.",
      });
    } finally {
      setLoading(false);
      setImageToDelete(null);
    }
  }

  // Manipula a seleção de arquivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviewImages: PreviewImage[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewImages.push({
          id: Math.random().toString(36).substring(7),
          url: reader.result as string,
          file: file,
        });
        setPreviewImages((prev) => [...prev, ...newPreviewImages]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove uma imagem da prévia
  const removePreviewImage = (id: string) => {
    setPreviewImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Upload de imagens
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (previewImages.length === 0) return;

    setUploading(true);
    try {
      // Upload de cada arquivo individualmente
      for (const previewImage of previewImages) {
        const formData = new FormData();
        formData.append("file", previewImage.file);

        const res = await fetch(`/api/admin/products/${productId}/imagens`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Erro ao enviar imagem");
        }

        const newImage = await res.json();
        setImages((prevImages) => [...prevImages, newImage]);
      }

      toast({
        title: "Sucesso",
        description: "Imagens enviadas com sucesso.",
      });

      // Limpa as prévias e o input após o upload
      setPreviewImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar as imagens.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto mt-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Imagens do Produto</h1>
        <Link href={`/admin/produtos/${productId}/editar`}>
          <Button variant="outline">Voltar para edição</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : images.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            Nenhuma imagem cadastrada.
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={img.url}
                alt="Imagem do produto"
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setImageToDelete(img.id)}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <form className="mt-6 border rounded-lg p-4" onSubmit={handleUpload}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Adicionar novas imagens
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* Grid de prévia das imagens */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {previewImages.map((preview) => (
                <div
                  key={preview.id}
                  className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={preview.url}
                    alt="Prévia"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removePreviewImage(preview.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={uploading || previewImages.length === 0}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Imagens
              </>
            )}
          </Button>
        </div>
      </form>

      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Imagem</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta imagem? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => imageToDelete && handleRemove(imageToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
