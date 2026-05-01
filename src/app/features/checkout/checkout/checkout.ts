import { Component } from '@angular/core';
import { CheckoutForm } from '../components/checkout-form/checkout-form';
import { OrderSummary } from '../../../shared/components/order-summary/order-summary';


@Component({
  selector: 'app-checkout',
  imports: [CheckoutForm, OrderSummary],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  
}
