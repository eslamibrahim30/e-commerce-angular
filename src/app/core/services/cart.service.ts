import { computed, Injectable, signal } from '@angular/core';
import { CartItem, Cart } from '../../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart_data';

  /** Internal writable signal — single source of truth */
  private _items = signal<CartItem[]>(this.loadFromStorage());

  /** Public readonly signal of cart items */
  readonly items = this._items.asReadonly();

  /**
   * Full Cart object with computed totals.
   * Automatically recomputes when items change.
   */
  readonly cart = computed<Cart>(() => {
    const items = this._items();
    return {
      userId: '',
      items,
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  });

  /** Convenient signal for navbar badge, etc. */
  readonly totalQuantity = computed(() => this.cart().totalQuantity);

  /**
   * Adds an item to the cart. If the item already exists, its quantity is incremented.
   */
  add(item: CartItem): void {
    this._items.update(items => {
      const existingIndex = items.findIndex(i => i.productId === item.productId);
      if (existingIndex !== -1) {
        return items.map((i, idx) =>
          idx === existingIndex
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...items, { ...item, quantity: item.quantity || 1 }];
    });
    this.persist();
  }

  /**
   * Removes an item from the cart by productId.
   */
  remove(productId: string): void {
    this._items.update(items => items.filter(item => item.productId !== productId));
    this.persist();
  }

  /**
   * Updates the quantity of a specific item in the cart.
   */
  updateQty(productId: string, quantity: number): void {
    this._items.update(items =>
      items.map(i => i.productId === productId ? { ...i, quantity } : i)
    );
    this.persist();
  }

  /**
   * Clears all items from the cart.
   */
  clear(): void {
    this._items.set([]);
    localStorage.removeItem(this.CART_KEY);
  }

  /** Reads initial data from localStorage */
  private loadFromStorage(): CartItem[] {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Syncs the current signal value to localStorage */
  private persist(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this._items()));
  }
}
