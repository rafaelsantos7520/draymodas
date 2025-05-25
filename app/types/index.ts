export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  sizes: Size[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
};

export type Size = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}; 