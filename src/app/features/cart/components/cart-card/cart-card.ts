import { Component, input, InputSignal } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../shared/models/cart.model';

@Component({
  selector: 'app-cart-card',
  imports: [],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css',
})
export class CartCard {
  item: InputSignal<CartItem> = input.required<CartItem>();
  constructor(private readonly cartService: CartService) {}
  increaseQty(productId: string) {
    const item = this.cartService.getItems().find((i) => i.productId === productId);
    if (!item) return;

    this.cartService.updateQty(productId, item.quantity + 1);
  }

  decreaseQty(productId: string) {
    const item = this.cartService.getItems().find((i) => i.productId === productId);
    if (!item) return;

    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      this.cartService.remove(productId);
    } else {
      this.cartService.updateQty(productId, newQty);
    }
  }

  removeItem(productId: string) {
    this.cartService.remove(productId);
  }
}
