"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product, Category, Size, ProductSize } from "@prisma/client";

type ProductWithRelations = Product & {
  sizes: (ProductSize & {
    size: Size;
  })[];
};

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  category: z.string().min(1, "Selecione uma categoria"),
  sizes: z.array(z.string()).min(1, "Selecione pelo menos um tamanho"),
  isActive: z.boolean(),
  isReady: z.boolean(),
  isFeatured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function EditProductForm({
  product,
  categories,
  sizes,
}: {
  product: ProductWithRelations;
  categories: Category[];
  sizes: Size[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    product.sizes.map((s) => s.size.id)
  );
  const { admin } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.categoryId || "",
      sizes: product.sizes.map((s) => s.size.id),
      isActive: product.isActive,
      isReady: product.isReady,
      isFeatured: product.isFeatured,
    },
  });

  const currentCategory = watch("category");

  useEffect(() => {
    if (product.categoryId) {
      setValue("category", product.categoryId);
    }
  }, [product.categoryId, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (!admin) {
        throw new Error("Admin não autenticado");
      }

      if (!data.category) {
        throw new Error("É necessário selecionar uma categoria");
      }

      const formData = new FormData();

      formData.append("adminId", admin.id);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("isActive", data.isActive.toString());
      formData.append("isReady", data.isReady.toString());
      formData.append("isFeatured", data.isFeatured.toString());

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar produto");
      }

      const result = await response.json();
      console.log("Produto atualizado com sucesso:", result);
      router.push("/admin/produtos");
    } catch (error) {
      console.error("Erro:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao atualizar produto"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-2xl border p-6 rounded-lg shadow-lg bg-white"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Editar Produto</h2>
        <Link
          href={`/admin/produtos/${product.id}/imagens`}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          <span>Gerenciar imagens</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Nome</Label>
          <Input
            {...register("name")}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Preço</Label>
          <Input
            type="number"
            {...register("price")}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <Label className="text-sm font-medium text-gray-700">Descrição</Label>
          <Textarea
            {...register("description")}
            className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-y"
            placeholder="Digite a descrição do produto..."
          />
          {errors.description && (
            <span className="text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Categoria</Label>
          <Select
            value={currentCategory}
            onValueChange={(value) => {
              setValue("category", value);
            }}
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Tamanhos</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sizes.map((size) => (
              <label key={size.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const newSizes = [...selectedSizes, size.id];
                      setSelectedSizes(newSizes);
                      setValue("sizes", newSizes);
                    } else {
                      const newSizes = selectedSizes.filter(
                        (id) => id !== size.id
                      );
                      setSelectedSizes(newSizes);
                      setValue("sizes", newSizes);
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{size.name}</span>
              </label>
            ))}
          </div>
          {errors.sizes && (
            <span className="text-red-500 text-sm">{errors.sizes.message}</span>
          )}
        </div>

        <div className="flex flex-row gap-8 items-center md:col-span-2">
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label
              htmlFor="isActive"
              className="text-sm font-normal text-gray-700"
            >
              Produto Ativo
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="isReady"
              checked={watch("isReady")}
              onCheckedChange={(checked) => setValue("isReady", checked)}
            />
            <Label
              htmlFor="isReady"
              className="text-sm font-normal text-gray-700"
            >
              Disponível Imediatamente
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="isFeatured"
              checked={watch("isFeatured")}
              onCheckedChange={(checked) => setValue("isFeatured", checked)}
            />
            <Label
              htmlFor="isFeatured"
              className="text-sm font-normal text-gray-700"
            >
              Destaque
              <span className="text-xs text-gray-500">
                ?
              </span>
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Link
          href="/admin/produtos"
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
