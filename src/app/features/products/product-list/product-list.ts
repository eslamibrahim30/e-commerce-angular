import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../shared/models/cart.model';
import { ProductDisplay } from '../../../shared/models/product.model';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCard],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  filteredProducts: ProductDisplay[] = [];
  pagedProducts: ProductDisplay[] = [];
  categories: string[] = [];

  // Pagination
  currentPage = 1;
  readonly pageSize = 8;
  totalPages = 1;
  pages: number[] = [];

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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categories = this.categoryService.getAll().map((c) => c.name);

    // Resolved Conflict: Handling both 'category' and 'search' from query params
    this.route.queryParams.subscribe((params) => {
      this.filters.category = params['category'] ?? '';
      this.filters.search = params['search'] ?? '';
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // Resolved Conflict: Kept type safety (ProductDisplay[])
    let result: ProductDisplay[] = [...this.productService.products()];

    if (this.filters.search) {
      const term = this.filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term),
      );
    }

    if (this.filters.category) {
      result = result.filter((p) => p.category === this.filters.category);
    }

    if (this.filters.min !== null) {
      result = result.filter((p) => p.price >= (this.filters.min as number));
    }

    if (this.filters.max !== null) {
      result = result.filter((p) => p.price <= (this.filters.max as number));
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
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedProducts();
  }

  private updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.filters = { search: '', category: '', min: null, max: null, sort: '' };
    this.applyFilters();
  }

  trackById(_index: number, item: ProductDisplay): string {
    return item.id;
  }

  addToCart(product: ProductDisplay): void {
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    // Resolved Conflict: Used the service method call from HEAD (dev had a syntax error)
    this.cartService.add(item);
  }
}