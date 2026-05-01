import { Component, inject, signal, WritableSignal } from '@angular/core';

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
  loading = false;
  private cartService=inject( CartService)
  cartItems=this.cartService.cart
  constructor(

    private router: Router,
  ) {}


  handleOrder() {
    this.loading = true;

    setTimeout(() => {
      
        this.router.navigate(['/order-confirmation']);


      this.loading = false;
    }, 800); // simulate API call
  }
}
