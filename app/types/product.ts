export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: {
    url: string;
  }[];
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
