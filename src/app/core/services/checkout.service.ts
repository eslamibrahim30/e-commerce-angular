import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

  private _shippingForm = signal<FormGroup | null>(null);

  shippingForm = this._shippingForm.asReadonly();

  setForm(form: FormGroup) {
    this._shippingForm.set(form);
  }

  getForm(): FormGroup | null {
    return this._shippingForm();
  }

}
