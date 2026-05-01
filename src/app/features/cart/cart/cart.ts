import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ICart } from '../../../shared/models/interfaces/cart';
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
export class Cart implements OnInit {
  isLoading: WritableSignal<boolean> = signal(false);
  cartItems: WritableSignal<any[]> = signal([]);
  constructor(private readonly cartService: CartService) {}
  ngOnInit(): void {
    this.cartItems=this.cartService.getCart()
  }
  get subtotal() {
    return this.cartService.getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shipping() {
    return this.subtotal > 100 ? 0 : 10;
  }

  get total() {
    return this.subtotal + this.shipping;
  }
}
