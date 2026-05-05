import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductDisplay } from '../../../shared/models/product.model';
import { CartItem } from '../../../shared/models/cart.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit, OnDestroy {
  product: ProductDisplay | undefined;
  relatedProducts: ProductDisplay[] = [];
  qty = 1;

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    // ✅ subscribe بدل snapshot — بيتحدث لما تدوس على related product
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('productId') ?? '';
      this.product = this.productService.getById(id);
      this.qty = 1;

      if (this.product) {
        this.relatedProducts = this.productService
          .products()
          .filter((p) => p.category === this.product!.category && p.id !== this.product!.id)
          .slice(0, 4);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  increase(): void {
    if (this.product && this.qty < this.product.stock) this.qty++;
  }

  decrease(): void {
    if (this.qty > 1) this.qty--;
  }

  addToCart(): void {
    if (!this.product || this.product.stock === 0) return;
    const item: CartItem = {
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.image,
      quantity: this.qty,
    };
    this.cartService.add(item);
  }
}
