"use client";

import type {
  Product,
  Category,
  Size,
  ProductSize,
  Image,
} from "@prisma/client";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import axios from "axios";
import { Badge } from "@/components/ui/badge";
type ProductWithRelations = Product & {
  category: Category;
  images: Image[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};

export function ProductListTable({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const router = useRouter();
  const [productToDelete, setProductToDelete] =
    useState<ProductWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `/api/admin/products/${productToDelete.id}`
      );

      if (response.status !== 200) {
        throw new Error("Erro ao deletar produto");
      }

      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
      <Table className="rounded-lg">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Pronta entrega</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Avatar className="w-10 h-10 rounded-md">
                  <AvatarImage src={product.images?.[0]?.url || ""} />
                  <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description.slice(0, 30)}...</TableCell>
              <TableCell>
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                <Badge
                  className={`rounded-md ${product.isActive ? "bg-green-500" : "bg-red-500"}`}
                >
                  {product.isActive ? "Sim" : "Não"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={`rounded-md ${product.isReady ? "bg-green-500" : "bg-red-500"}`}
                >
                  {product.isReady ? "Sim" : "Não"}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/produtos/${product.id}/editar`)
                  }
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setProductToDelete(product)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}
              "? Esta ação não pode ser desfeita e todas as imagens serão
              removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
