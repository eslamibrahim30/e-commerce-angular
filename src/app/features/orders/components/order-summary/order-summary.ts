import { Component, signal, WritableSignal } from '@angular/core';
import { ICart } from '../../../../shared/models/interfaces/cart';
import { CartService } from '../../cart/services/cart-service';

@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  cartItems:WritableSignal <ICart[]>=signal([])
  subtotal:WritableSignal<number>=signal(0)
  constructor(private readonly cartService:CartService){}
  ngOnInit():void{
    this.cartService.cart$.subscribe({
      next:res=>this.cartItems.set(res),
      error: err=>console.log(err)
    })
    this.subtotal.set(this.cartService.subtotal)
  }
}
