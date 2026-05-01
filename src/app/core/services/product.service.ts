import { inject, Injectable } from '@angular/core';
import { Product, ProductDisplay } from '../../shared/models/product.model';
import { CategoryService } from './category.service';
import productsData from '../../shared/data/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products_data';
  private categoryService = inject(CategoryService);

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(productsData));
    }
  }

  /**
   * Returns all products enriched with their resolved category name.
   */
  getAll(): ProductDisplay[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const products: Product[] = data ? JSON.parse(data) : [];
    return products.map(p => this.enrichWithCategory(p));
  }

  /**
   * Returns a single product by ID, enriched with category name.
   */
  getById(id: string): ProductDisplay | undefined {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const products: Product[] = data ? JSON.parse(data) : [];
    const product = products.find(p => p.id === id);
    return product ? this.enrichWithCategory(product) : undefined;
  }

  /**
   * Returns all products belonging to a specific category.
   */
  getByCategory(categoryId: string): ProductDisplay[] {
    return this.getAll().filter(p => p.categoryId === categoryId);
  }

  /**
   * Returns all featured products.
   */
  getFeatured(): ProductDisplay[] {
    return this.getAll().filter(p => p.isFeatured);
  }

  add(product: Product): void {
    const products = this.getAllRaw();
    products.push(product);
    this.save(products);
  }

  update(id: string, productData: Partial<Product>): void {
    const products = this.getAllRaw();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      this.save(products);
    }
  }

  delete(id: string): void {
    const products = this.getAllRaw().filter(p => p.id !== id);
    this.save(products);
  }

  /**
   * Returns raw Product[] from localStorage (without category enrichment).
   * Used internally for write operations.
   */
  private getAllRaw(): Product[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private save(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }

  private enrichWithCategory(product: Product): ProductDisplay {
    const category = this.categoryService.getById(product.categoryId);
    return {
      ...product,
      category: category ? category.name : 'Unknown'
    };
  }
}
