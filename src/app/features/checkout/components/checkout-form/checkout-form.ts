import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutService } from '../../../../core/services/checkout.service';


@Component({
  selector: 'app-checkout-form',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.css',
})
export class CheckoutForm implements OnInit {
  private fb = inject(FormBuilder);
  private checkoutService = inject(CheckoutService);

  shippingForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    paymentMethod: ['cod', Validators.required],
  });

  ngOnInit() {
    this.checkoutService.setForm(this.shippingForm); // 🔥 مهم جدًا
  }

  get value() {
    return this.shippingForm.value;
  }

  isValid() {
    return this.shippingForm.valid;
  }
}
