import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCard],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];

  filters = {
    search: '',
    category: '',
    min: null as number | null,
    max: null as number | null,
    sort: '',
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.products = this.productService.products();
    this.categories = [
      ...new Set(this.products.map((p) => p.category).filter((c) => c && c !== 'unknown')),
    ];
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.products];

    if (this.filters.search) {
      const term = this.filters.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
      );
    }

    if (this.filters.category) {
      result = result.filter((p) => p.category === this.filters.category);
    }

    if (this.filters.min !== null) {
      result = result.filter((p) => p.price >= this.filters.min!);
    }

    if (this.filters.max !== null) {
      result = result.filter((p) => p.price <= this.filters.max!);
    }

    switch (this.filters.sort) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result = [...result].reverse();
        break;
    }

    this.filteredProducts = result;
  }

  resetFilters() {
    this.filters = {
      search: '',
      category: '',
      min: null,
      max: null,
      sort: '',
    };
    this.applyFilters();
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  addToCart(product: any) {
    this.cartService.add({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
    });
  }
}
