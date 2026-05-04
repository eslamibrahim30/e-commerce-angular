import { Component, inject } from '@angular/core';
import { computed } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../models/cart.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { CheckoutService } from '../../../core/services/checkout.service';
@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  toastMessage = '';
  showToast = false;
  loading = false;
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private checkoutService = inject(CheckoutService);
  cartItems = this.cartService.cart;
  isCartEmpty = computed(() => this.cartItems().items.length === 0);
  constructor(private router: Router) {}
  isCheckoutPage() {
    return this.router.url.includes('checkout');
  }
  showError(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
  async handleOrder() {
    if (this.isCartEmpty()) return;

    if (!this.router.url.includes('checkout')) {
      this.router.navigate(['/checkout']);
      return;
    }

    const checkoutForm = this.checkoutService.getForm();

    if (!checkoutForm || checkoutForm.invalid) {
      this.showError('Please fill shipping form');
      return;
    }

    this.loading = true;

    try {
      const user = this.authService.getUser();
      if (!user) return;

      const shipping = checkoutForm.value;

      const order = {
        userId: user.id,
        items: this.cartItems().items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        total: this.cartItems().totalPrice,
        status: 'Pending',
        shipping,
      };

      this.orderService.placeOrder(order);
      this.cartService.clear();

      await new Promise((r) => setTimeout(r, 500));

      this.router.navigate(['/order-confirmation']);
    } finally {
      this.loading = false;
    }
  }
}
