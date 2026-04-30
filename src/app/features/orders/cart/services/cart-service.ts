import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICart } from '../../../../shared/models/interfaces/cart';



@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart';

  private cartSubject = new BehaviorSubject<ICart[]>(this.loadCart());

  cart$ = this.cartSubject.asObservable();

  private loadCart(): ICart[] {
    const cart = localStorage.getItem(this.cartKey);
    console.log(cart)
    return cart ? JSON.parse(cart) : [];
  }

  private saveCart(cart: ICart[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(product: ICart) {
    const cart = this.loadCart();

    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.saveCart(cart);
  }

  removeItem(id: number) {
    const cart = this.loadCart().filter((i) => i.id !== id);

    this.saveCart(cart);
  }

  increaseQty(id: number) {
    const cart = this.loadCart();

    const item = cart.find((i) => i.id === id);

    if (item) item.quantity++;

    this.saveCart(cart);
  }

  decreaseQty(id: number) {
    const cart = this.loadCart();

    const item = cart.find((i) => i.id === id);

    if (item && item.quantity > 1) item.quantity--;

    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  get subtotal() {
    return this.loadCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
