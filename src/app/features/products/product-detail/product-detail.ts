import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {

  product: any;
  qty: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('productId')!;
    this.product = this.productService.getById(id);
  }

  addToCart() {
    this.cartService.add({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      imageUrl: this.product.imageUrl,
      quantity: this.qty
    });

    alert('Added to cart ✅');
  }
}
