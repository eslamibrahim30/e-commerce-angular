import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart_data';

  constructor() {}

  getCart(): any[] {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  add(item: any): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(i => i.productId === item.productId);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += item.quantity || 1;
    } else {
      cart.push({ ...item, quantity: item.quantity || 1 });
    }
    this.saveCart(cart);
  }

  remove(productId: string): void {
    const cart = this.getCart().filter(item => item.productId !== productId);
    this.saveCart(cart);
  }

  updateQty(productId: string, quantity: number): void {
    const cart = this.getCart();
    const index = cart.findIndex(i => i.productId === productId);
    if (index !== -1) {
      cart[index].quantity = quantity;
      this.saveCart(cart);
    }
  }

  clear(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  private saveCart(cart: any[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }
}
