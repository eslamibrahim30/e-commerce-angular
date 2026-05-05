import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { Order, OrderItem } from '../../shared/models/order.model';

export interface OrderItemDisplay extends OrderItem {
  name: string;
  image: string;
}
interface OrderWithExpanded extends Order {
  items: OrderItemDisplay[];
}
@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  expandedOrders = signal<Set<string>>(new Set());

  orders = computed<OrderWithExpanded[]>(() => {
    const user = this.authService.getUser();
    const allOrders = this.orderService.orders();

    if (!user) return [];

    const userOrders = allOrders
      .filter((o) => o.userId === user.id)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return userOrders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const product = this.productService.getById(item.productId);
        return {
          ...item,
          name: product?.name ?? 'Unknown Product',
          image: product?.image ?? 'https://via.placeholder.com/64',
        };
      }),
    }));
  });

  toggleOrder(id: string) {
    this.expandedOrders.update((set) => {
      const newSet = new Set(set);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }
}
