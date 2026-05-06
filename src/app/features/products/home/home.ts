import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';


import { ProductCard } from '../../../shared/components/product-card/product-card';

import { ZoraModalComponent } from '../../../shared/components/zora-modal/zora-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard, ZoraModalComponent],
  templateUrl: './home.html',
  styleUrl:'./home.css'
})
export class Home {
  showModal = false;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);


  featuredProducts = computed(() => this.productService.products().slice(0, 6));

  categories = computed(() =>
    [...new Set(this.productService.products().map(p => p.category))]
  );

  addToCart(product: any) {
    this.cartService.add({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    this.showModal = true;
  }
  goToCart() {
  this.showModal = false;
  this.router.navigate(['/cart']);
}
}
