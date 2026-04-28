import { Injectable } from '@angular/core';
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

  getOrders(): any[] {
    const data = localStorage.getItem(this.ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): any {
    return this.getOrders().find(o => o.id === id);
  }

  placeOrder(order: any): void {
    const orders = this.getOrders();
    orders.push({
      ...order,
      id: `ord-${Date.now()}`,
      date: new Date().toISOString()
    });
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }
}
