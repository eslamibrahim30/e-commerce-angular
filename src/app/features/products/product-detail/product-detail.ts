import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  qty: number = 1;

  /** Reactively look up the product from the signal by route param */
  product = computed(() => {
    const id = this.route.snapshot.paramMap.get('productId')!;
    return this.productService.getById(id);
  });

  addToCart() {
    const p = this.product();
    if (!p) return;

    this.cartService.add({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: this.qty
    });

    alert('Added to cart ✅');
  }
}
