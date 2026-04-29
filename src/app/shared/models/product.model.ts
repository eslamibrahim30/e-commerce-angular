export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;    // Optional: Only exists if the item is on sale
  categoryId: string;
  description: string;
  image: string;
  stock: number;
  isFeatured?: boolean; // Optional: Defaults to undefined (falsy) if not set
}