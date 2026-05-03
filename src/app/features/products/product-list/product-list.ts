import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './product-list.html',
})
export class ProductList {

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = this.productService.products;

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
