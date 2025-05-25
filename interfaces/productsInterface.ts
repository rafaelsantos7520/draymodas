export interface ICategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISize {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  categoryId: string;
  category?: ICategory;
  sizes: ISize[];
  isActive: boolean;
  isReady: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
}
