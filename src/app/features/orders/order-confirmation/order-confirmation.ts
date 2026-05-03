import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { Order } from '../../../shared/models/order.model';

interface OrderWithExpanded extends Order {
  expanded: boolean;
  items: any[]; // with name, image
}

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  orders = signal<OrderWithExpanded[]>([]);

  constructor() {
    effect(() => {
      const user = this.authService.session();
      if (user) {
        const userOrders = this.orderService.getByUserId(user.id);
        const ordersWithExpanded = userOrders.map((order) => ({
          ...order,
          expanded: false,
          items: order.items.map((item) => {
            const product = this.productService.getById(item.productId);
            return {
              ...item,
              name: product?.name || 'Unknown Product',
              image: product?.image || 'https://via.placeholder.com/64',
            };
          }),
        }));
        this.orders.set(ordersWithExpanded);
      } else {
        this.orders.set([]);
      }
    });
  }

  toggleOrder(id: string) {
    this.orders.update((orders) =>
      orders.map((order) => (order.id === id ? { ...order, expanded: !order.expanded } : order)),
    );
  }
}
