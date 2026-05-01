import { Component, signal, WritableSignal } from '@angular/core';

import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  cartItems: WritableSignal<Cart> = signal({
    userId: '',
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  });
  loading = false;
  isCartRoute = false;
  constructor(

    private readonly cartService: CartService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.cartItems.set(this.cartService.getCart());
    this.isCartRoute = this.router.url.includes('cart');
  }

  handleOrder() {
    this.loading = true;

    setTimeout(() => {
      if (this.isCartRoute) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/order-confirmation']);
      }

      this.loading = false;
    }, 800); // simulate API call
  }
}
