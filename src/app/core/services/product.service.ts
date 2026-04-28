import { Injectable } from '@angular/core';
import productsData from '../../shared/data/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products_data';

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(productsData));
    }
  }

  getAll(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): any {
    return this.getAll().find(p => p.id === id);
  }

  add(product: any): void {
    const products = this.getAll();
    products.push(product);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }

  update(id: string, productData: any): void {
    let products = this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
  }

  delete(id: string): void {
    let products = this.getAll();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }
}
