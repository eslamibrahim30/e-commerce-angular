import { Component, OnInit } from '@angular/core';
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
export class Home implements OnInit {

  featuredProducts: any[] = [];
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const products = this.productService.getAll();

    this.featuredProducts = products.slice(0, 6);
    this.categories = [...new Set(products.map(p => p.category))];
  }

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
