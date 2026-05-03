import { Component, inject, input } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../shared/models/cart.model';

@Component({
  selector: 'app-cart-card',
  imports: [],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css',
})
export class CartCard {
  item = input.required<CartItem>();

  private cartService = inject(CartService);

  increaseQty() {
    const currentItem = this.item();
    this.cartService.updateQty(currentItem.productId, currentItem.quantity + 1);
  }

  decreaseQty() {
    const currentItem = this.item();
    const newQty = currentItem.quantity - 1;

    if (newQty <= 0) {
      this.cartService.remove(currentItem.productId);
    } else {
      this.cartService.updateQty(currentItem.productId, newQty);
    }
  }

  removeItem() {
    this.cartService.remove(this.item().productId);
  }
}

