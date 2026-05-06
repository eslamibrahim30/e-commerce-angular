export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shipping: Shipping;
}
export interface Shipping {
  name: string;
  email: string;
  phone: string;
  address: string;
}
