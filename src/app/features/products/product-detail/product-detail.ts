import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ZoraInputComponent } from '../../../shared/components/zora-input/zora-input';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZoraInputComponent],
  templateUrl: './product-detail.html',
})
export class ProductDetail {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  qtyControl = new FormControl(1, [Validators.required, Validators.min(1)]);

  /** Reactively look up the product from the signal by route param */
  product = computed(() => {
    const id = this.route.snapshot.paramMap.get('productId')!;
    return this.productService.getById(id);
  });

  addToCart() {
    const p = this.product();
    if (!p || this.qtyControl.invalid) return;

    this.cartService.add({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: this.qtyControl.value || 1
    });

    alert('Added to cart ✅');
  }
}
