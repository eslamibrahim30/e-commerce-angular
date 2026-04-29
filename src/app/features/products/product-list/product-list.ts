import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOption: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getAll();
    this.filteredProducts = [...this.products];

    this.categories = [...new Set(this.products.map((p) => p.category))];
  }

  applyFilters() {
    let result = [...this.products];

    // search
    if (this.searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    // category
    if (this.selectedCategory) {
      result = result.filter((p) => p.category === this.selectedCategory);
    }

    // price
    if (this.minPrice !== null) {
      result = result.filter((p) => p.price >= this.minPrice!);
    }

    if (this.maxPrice !== null) {
      result = result.filter((p) => p.price <= this.maxPrice!);
    }

    // sorting
    switch (this.sortOption) {
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
        result.reverse();
        break;
    }

    this.filteredProducts = result;
  }

  addToCart(product: any) {
    this.cartService.add({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    alert('Added to cart ✅');
  }
}
