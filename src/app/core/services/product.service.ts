import { computed, inject, Injectable, signal } from '@angular/core';
import { Product, ProductDisplay } from '../../shared/models/product.model';
import { CategoryService } from './category.service';
import productsData from '../../shared/data/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products_data';
  private categoryService = inject(CategoryService);

  /** Internal writable signal — single source of truth */
  private _products = signal<Product[]>(this.loadFromStorage());

  /**
   * All products enriched with their resolved category name.
   * Automatically recomputes when _products or categories change.
   */
  readonly products = computed<ProductDisplay[]>(() => {
    const categories = this.categoryService.categories();
    return this._products().map(p => {
      const category = categories.find(c => c.id === p.categoryId);
      return { ...p, category: category ? category.name : 'Unknown' };
    });
  });

  /** All featured products */
  readonly featured = computed<ProductDisplay[]>(() =>
    this.products().filter(p => p.isFeatured)
  );

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(productsData));
      this._products.set(productsData as Product[]);
    }
  }

  /**
   * Returns a single product by ID, enriched with category name.
   */
  getById(id: string): ProductDisplay | undefined {
    return this.products().find(p => p.id === id);
  }

  /**
   * Returns all products belonging to a specific category.
   */
  getByCategory(categoryId: string): ProductDisplay[] {
    return this.products().filter(p => p.categoryId === categoryId);
  }

  add(product: Product): void {
    this._products.update(prods => [...prods, product]);
    this.persist();
  }

  update(id: string, productData: Partial<Product>): void {
    this._products.update(prods =>
      prods.map(p => p.id === id ? { ...p, ...productData } : p)
    );
    this.persist();
  }

  delete(id: string): void {
    this._products.update(prods => prods.filter(p => p.id !== id));
    this.persist();
  }

  /** Reads initial data from localStorage */
  private loadFromStorage(): Product[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Syncs the current signal value to localStorage */
  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._products()));
  }
}
