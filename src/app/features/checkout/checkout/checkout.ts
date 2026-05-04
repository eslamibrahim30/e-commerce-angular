import { Component, ViewChild } from '@angular/core';
import { CheckoutForm } from '../components/checkout-form/checkout-form';
import { OrderSummary } from '../../../shared/components/order-summary/order-summary';

@Component({
  selector: 'app-checkout',
  imports: [CheckoutForm, OrderSummary],
  templateUrl: './checkout.html',
})
export class Checkout {

  @ViewChild(CheckoutForm) form!: CheckoutForm;

  getShippingData() {
    return this.form.value;
  }

  isFormValid() {
    return this.form.isValid();
  }
}
