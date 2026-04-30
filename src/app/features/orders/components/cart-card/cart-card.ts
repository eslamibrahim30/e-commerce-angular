import { Component, input, InputSignal } from '@angular/core';
import { ICart } from '../../../../shared/models/interfaces/cart';
import { CartService } from '../../cart/services/cart-service';

@Component({
  selector: 'app-cart-card',
  imports: [],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css',
})
export class CartCard {
  item: InputSignal<ICart> = input.required<ICart>();
  constructor(private readonly cartService: CartService) {}
  increaseQty(id: number) {
    return this.cartService.increaseQty(id);
  }

  decreaseQty(id: number) {
    return this.cartService.decreaseQty(id);
  }

  removeItem(id: number) {
    return this.cartService.removeItem(id);
  }
}
