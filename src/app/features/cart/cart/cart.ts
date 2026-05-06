import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderSummary } from '../../../shared/components/order-summary/order-summary';
import { CartService } from '../../../core/services/cart.service';
import { CartCard } from '../components/cart-card/cart-card';
@Component({
  selector: 'app-cart',
  imports: [CartCard, RouterLink, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart  {
  isLoading: WritableSignal<boolean> = signal(false);
  private cartService=inject(CartService)
  cartItems=this.cartService.cart




}
