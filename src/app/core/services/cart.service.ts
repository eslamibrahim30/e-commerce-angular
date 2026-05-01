import { Injectable } from '@angular/core';
import { CartItem, Cart } from '../../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart_data';

  constructor() {}

  /**
   * Returns the full Cart object with computed totals.
   */
  getCart(): Cart {
    const items = this.getItems();
    return {
      userId: '',
      items,
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  /**
   * Returns the raw CartItem array from localStorage.
   */
  getItems(): CartItem[] {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Adds an item to the cart. If the item already exists, its quantity is incremented.
   */
  add(item: CartItem): void {
    const items = this.getItems();
    const existingIndex = items.findIndex(i => i.productId === item.productId);
    if (existingIndex !== -1) {
      items[existingIndex].quantity += item.quantity || 1;
    } else {
      items.push({ ...item, quantity: item.quantity || 1 });
    }
    this.save(items);
  }

  /**
   * Removes an item from the cart by productId.
   */
  remove(productId: string): void {
    const items = this.getItems().filter(item => item.productId !== productId);
    this.save(items);
  }

  /**
   * Updates the quantity of a specific item in the cart.
   */
  updateQty(productId: string, quantity: number): void {
    const items = this.getItems();
    const index = items.findIndex(i => i.productId === productId);
    if (index !== -1) {
      items[index].quantity = quantity;
      this.save(items);
    }
  }

  /**
   * Clears all items from the cart.
   */
  clear(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  private save(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
  }
}
