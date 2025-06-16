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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type ProductWithRelations = Product & {
  category: Category;
  images: Image[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};

export function ProductList({
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
        console.log(response.data);
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
      {/* Desktop View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <Table className="rounded-lg min-w-[800px]">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead className="min-w-[150px]">Nome</TableHead>
              <TableHead className="min-w-[200px]">Descrição</TableHead>
              <TableHead className="w-[100px]">Preço</TableHead>
              <TableHead className="w-[80px]">Ativo</TableHead>
              <TableHead className="w-[120px]">Pronta entrega</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
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
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {product.description}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-md ${
                      product.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {product.isActive ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-md ${
                      product.isReady ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {product.isReady ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/produtos/${product.id}/editar`)
                      }
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setProductToDelete(product)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 rounded-md">
                  <AvatarImage src={product.images?.[0]?.url || ""} />
                  <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge
                  className={`rounded-md ${
                    product.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {product.isActive ? "Ativo" : "Inativo"}
                </Badge>
                <Badge
                  className={`rounded-md ${
                    product.isReady ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {product.isReady ? "Pronta entrega" : "Sob encomenda"}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
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
                className="flex-1"
                onClick={() => setProductToDelete(product)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
