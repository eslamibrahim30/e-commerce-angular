import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {

  product: any;
  relatedProducts: any[] = [];
  qty: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('productId')!;
    this.product = this.productService.getById(id);

    const all = this.productService.products();

    this.relatedProducts = all
      .filter(p => p.category === this.product.category && p.id !== this.product.id)
      .slice(0, 4);
  }

  increase() {
    this.qty++;
  }

  decrease() {
    if (this.qty > 1) this.qty--;
  }

  addToCart() {
    this.cartService.add({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.imageUrl,
      quantity: this.qty
    });
  }
}
