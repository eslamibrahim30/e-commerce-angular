import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ICart } from '../../../shared/models/interfaces/cart';
import { CartCard } from '../components/cart-card/cart-card';
import { CartService } from './services/cart-service';
import { RouterLink } from "@angular/router";
import { OrderSummary } from "../components/order-summary/order-summary";

@Component({
  selector: 'app-cart',
  imports: [CartCard, RouterLink, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  isLoading:WritableSignal<boolean> = signal(false);
  cartItems: WritableSignal<ICart[]> = signal([]);
  constructor(private readonly cartService: CartService) {}
  ngOnInit(): void {
    this.cartService.cart$.subscribe({
      next: (res) => this.cartItems.set(res),
      error: (err) => console.log(err),
    });
  }
  get subtotal() {
    return this.cartService.subtotal;
  }

  get shipping() {
    return this.subtotal > 100 ? 0 : 10;
  }

  get total() {
    return this.subtotal + this.shipping;
  }
}
