"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Category, Size } from "@prisma/client";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  sizes: z.array(z.string()).min(1, "Selecione pelo menos um tamanho"),
});

type ProductFormData = z.infer<typeof productSchema>;

export function NewProductForm({
  categories,
  sizes,
}: {
  categories: Category[];
  sizes: Size[];
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { admin } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categories: [],
      sizes: [],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      if (!admin) {
        throw new Error("Admin não autenticado");
      }

      const formData = new FormData();

      // Adiciona os dados básicos primeiro
      formData.append("adminId", admin.id);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);

      // Adiciona as categorias e tamanhos como JSON strings
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("sizes", JSON.stringify(data.sizes));

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar produto");
      }
      setIsLoading(false);
      const result = await response.json();
      toast.success("Produto criado com sucesso");
      console.log("Produto criado com sucesso:", result);

      // Redireciona para a página de produtos após sucesso
      router.push(`/admin/produtos/${result.data.id}/imagens`);
    } catch (error) {
      setIsLoading(false);
      console.error("Erro:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full md:max-w-2xl  rounded-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Nome</Label>
          <Input {...register("name")} />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Descrição</Label>
          <Textarea {...register("description")} />
          {errors.description && (
            <span className="text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Preço</Label>
          <Input step="0.01" type="number" {...register("price")} />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Categorias</Label>
          <Select
            onValueChange={(value) => {
              const newCategories = [...selectedCategories, value];
              setSelectedCategories(newCategories);
              setValue("categories", newCategories);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione as categorias" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map((catId) => {
              const category = categories.find((c) => c.id === catId);
              return (
                <div
                  key={catId}
                  className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-2"
                >
                  <span>{category?.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newCategories = selectedCategories.filter(
                        (id) => id !== catId
                      );
                      setSelectedCategories(newCategories);
                      setValue("categories", newCategories);
                    }}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          {errors.categories && (
            <span className="text-red-500 text-sm">
              {errors.categories.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tamanhos</Label>
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
      </div>
      <Button
        disabled={isLoading}
           className="w-full bg-emerald-600 hover:bg-emerald-600/90"
        type="submit"
      >
        {isLoading ? "Criando..." : "Criar Produto"}
      </Button>
    </form>
  );
}
