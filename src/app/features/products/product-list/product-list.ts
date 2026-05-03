import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCard],
  templateUrl: './product-list.html',


})
export class ProductList implements OnInit {
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
    private categoryService: CategoryService,
    private cartService: CartService,
  ) {}

 ngOnInit(): void {
  console.log('categories:', this.categoryService.getAll());
  console.log('products sample:', this.productService.products().slice(0, 3));

  this.categories = this.categoryService.getAll().map((c) => c.name);
  this.applyFilters();
}

  applyFilters() {
    // ✅ اقرأ الـ signal كل مرة هنا بدل مرة واحدة في ngOnInit
    // عشان تضمن إن الـ computed (products مع category) خلص
    let result = [...this.productService.products()];

    if (this.filters.search) {
      const term = this.filters.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term),
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
    this.filters = { search: '', category: '', min: null, max: null, sort: '' };
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
      image: product.image,
      quantity: 1,
    });

  }


}
