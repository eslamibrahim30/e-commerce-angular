export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
