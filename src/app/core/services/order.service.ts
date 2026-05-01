import { Injectable } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import ordersData from '../../shared/data/orders.json';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ORDERS_KEY = 'orders_data';

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(ordersData));
    }
  }

  /**
   * Returns all orders.
   */
  getAll(): Order[] {
    const data = localStorage.getItem(this.ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Returns a single order by ID.
   */
  getById(id: string): Order | undefined {
    return this.getAll().find(o => o.id === id);
  }

  /**
   * Returns all orders for a specific user.
   */
  getByUserId(userId: string): Order[] {
    return this.getAll().filter(o => o.userId === userId);
  }

  /**
   * Places a new order. Auto-generates id and date.
   * Returns the created order.
   */
  placeOrder(order: Omit<Order, 'id' | 'date'>): Order {
    const orders = this.getAll();
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      date: new Date().toISOString()
    };
    orders.push(newOrder);
    this.save(orders);
    return newOrder;
  }

  /**
   * Updates the status of an existing order (e.g. for admin use).
   */
  updateStatus(id: string, status: string): void {
    const orders = this.getAll();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      this.save(orders);
    }
  }

  /**
   * Deletes an order by ID.
   */
  delete(id: string): void {
    const orders = this.getAll().filter(o => o.id !== id);
    this.save(orders);
  }

  private save(orders: Order[]): void {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }
}
