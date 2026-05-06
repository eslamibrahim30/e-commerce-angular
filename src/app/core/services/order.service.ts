import { Injectable, signal } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import { SEED_ORDERS } from '../../shared/data/seed.data';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ORDERS_KEY = 'orders_data';

  /** Internal writable signal — single source of truth */
  private _orders = signal<Order[]>(this.loadFromStorage());

  /** Public readonly signal for consumers */
  readonly orders = this._orders.asReadonly();

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(SEED_ORDERS));
      this._orders.set(SEED_ORDERS);
    }
  }

  /**
   * Returns a single order by ID.
   */
  getById(id: string): Order | undefined {
    return this._orders().find(o => o.id === id);
  }

  /**
   * Returns all orders for a specific user.
   */
  getByUserId(userId: string): Order[] {
    return this._orders().filter(o => o.userId === userId);
  }

  /**
   * Places a new order. Auto-generates id and date.
   * Returns the created order.
   */
  placeOrder(order: Omit<Order, 'id' | 'date'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      date: new Date().toISOString()
    };
    this._orders.update(orders => [...orders, newOrder]);
    this.persist();
    return newOrder;
  }

  /**
   * Updates the status of an existing order (e.g. for admin use).
   */
  updateStatus(id: string, status: string): void {
    this._orders.update(orders =>
      orders.map(o => o.id === id ? { ...o, status } : o)
    );
    this.persist();
  }

  /**
   * Deletes an order by ID.
   */
  delete(id: string): void {
    this._orders.update(orders => orders.filter(o => o.id !== id));
    this.persist();
  }

  getAll(): Order[] {
    return this._orders();
  }

  totalRevenue(): number {
    return this._orders().reduce((sum, o) => sum + o.total, 0);
  }

  count(): number {
    return this._orders().length;
  }

  pendingCount(): number {
    return this._orders().filter(o => o.status === 'Pending').length;
  }

  /** Reads initial data from localStorage */
  private loadFromStorage(): Order[] {
    const data = localStorage.getItem(this.ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Syncs the current signal value to localStorage */
  private persist(): void {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(this._orders()));
  }
}
