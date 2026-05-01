import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
})
export class Home {

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  /** First 6 products — reactively derived from the products signal */
  featuredProducts = computed(() => this.productService.products().slice(0, 6));

  /** Unique category names — reactively derived from the products signal */
  categories = computed(() =>
    [...new Set(this.productService.products().map(p => p.category))]
  );

  addToCart(product: any) {
    this.cartService.add({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    });
    alert('Added to cart ✅');
  }
}
