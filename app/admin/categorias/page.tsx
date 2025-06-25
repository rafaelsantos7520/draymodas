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
    <div className="container mx-auto px-2 py-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Categorias
          </h1>
          <Button
            variant="default"
            className="text-white rounded-xl w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 transition shadow-md"
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2 text-white" />
            Criar Categoria
          </Button>
        </div>

        {/* Cards View - Mobile */}
        <div className="grid grid-cols-1 sm:hidden gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.productsCount} produtos
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-xl transition shadow-md"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2 text-white" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-xl w-full text-white bg-red-500 hover:bg-red-600 transition shadow-md disabled:bg-red-300 disabled:text-white/60"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={category.productsCount > 0}
                  >
                    <Trash className="w-4 h-4 mr-2 text-white" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table View - Desktop */}
        <div className="hidden sm:block">
          <Table className="border border-gray-200 rounded-xl">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[40%]">Nome</TableHead>
                <TableHead className="w-[30%]">Produtos</TableHead>
                <TableHead className="w-[30%]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.productsCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 transition shadow-md"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-2 text-white" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl text-white bg-red-500 hover:bg-red-600 transition shadow-md disabled:bg-red-300 disabled:text-white/60"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.productsCount > 0}
                      >
                        <Trash className="w-4 h-4 mr-2 text-white" />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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
