import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {

  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.products = this.productService.getAll();
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
