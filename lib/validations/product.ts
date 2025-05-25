import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior ou igual a 0").default(0),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  isActive: z.boolean().default(true),
  isReady: z.boolean().default(false),
  images: z.array(z.any()).optional(),
  sizeIds: z.array(z.string()).min(1, "Selecione pelo menos um tamanho"),
});

export type ProductFormData = z.infer<typeof productSchema>;
