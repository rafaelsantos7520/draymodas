import { Product, Category, Image, ProductSize, Size } from "@prisma/client";

export type ProductWithRelations = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: Image[];
  sizes: (ProductSize & {
    size: Size;
  })[];
};
