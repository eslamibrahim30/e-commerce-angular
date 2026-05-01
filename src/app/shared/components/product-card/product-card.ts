import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { HoverGlowDirective } from '../../directives/hover-glow/hover-glow';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, HoverGlowDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

  onAdd() {
    this.addToCart.emit(this.product);
  }

  getDiscountPercentage(): number {
    if (this.product.oldPrice && this.product.oldPrice > this.product.price) {
      const discount = ((this.product.oldPrice - this.product.price) / this.product.oldPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  }
}
