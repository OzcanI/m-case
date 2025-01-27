export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  featuredImage: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>; 