import { Component, inject, signal, WritableSignal } from '@angular/core';

import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../models/cart.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  loading = false;
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  cartItems = this.cartService.cart;
  constructor(private router: Router) {}

  async handleOrder() {
    this.loading = true;

    try {

      const orderItems = this.cartItems().items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = {
        userId: this.authService.session()?.id,
        items: orderItems,
        total: this.cartItems().totalPrice,
        status: 'Pending',
      };

      this.orderService.placeOrder(order);

      this.cartService.clear?.();

      await new Promise((resolve) => setTimeout(resolve, 500));

      this.router.navigate(['/order-confirmation']);
    } finally {
      this.loading = false;
    }
  }
}
