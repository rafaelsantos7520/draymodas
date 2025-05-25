"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { toast } from "sonner";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  productsCount: number;
}

export default function Categorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/admin/categories");
      if (response.status !== 200) {
        throw new Error("Erro ao buscar categorias");
      }
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (data: { name: string }) => {
    try {
      const response = await axios.post("/api/admin/categories", data);
      if (response.status !== 200) {
        throw new Error("Erro ao criar categoria");
      }

      await fetchCategories();
      toast.success("Categoria criada com sucesso");
    } catch (error) {
      throw error;
    }
  };

  const handleEditCategory = async (data: { name: string }) => {
    try {
      if (!selectedCategory) throw new Error("Categoria não selecionada");

      const response = await axios.put(
        `/api/admin/categories/${selectedCategory.id}`,
        data
      );
      if (response.status !== 200) {
        throw new Error("Erro ao editar categoria");
      }

      await fetchCategories();
      toast.success("Categoria atualizada com sucesso");
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await axios.delete(
        `/api/admin/categories/${categoryId}`
      );

      if (response.status !== 200) {
        throw new Error("Erro ao excluir categoria");
      }

      await fetchCategories();
      toast.success("Categoria excluída com sucesso");
    } catch (error) {
      console.error("Erro:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir categoria"
      );
    }
  };

  return (
    <div className="container px-2 md:px-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tighter text-primary">
          Categorias
        </h1>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Criar Categoria
        </Button>
      </div>

      <Table className="border border-gray-200 rounded-xl">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Produtos</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.productsCount}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="default"
                  className="rounded-xl"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={category.productsCount > 0}
                >
                  <Trash className="w-4 h-4" />
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={selectedCategory ? handleEditCategory : handleCreateCategory}
        initialData={
          selectedCategory ? { name: selectedCategory.name } : undefined
        }
        title={selectedCategory ? "Editar Categoria" : "Criar Categoria"}
      />
    </div>
  );
}
