import { Injectable } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import categoriesData from '../../shared/data/categories.json';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories_data';

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categoriesData));
    }
  }

  getAll(): Category[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): Category | undefined {
    return this.getAll().find(c => c.id === id);
  }

  add(category: Category): void {
    const categories = this.getAll();
    categories.push(category);
    this.save(categories);
  }

  update(id: string, categoryData: Partial<Category>): void {
    const categories = this.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      this.save(categories);
    }
  }

  delete(id: string): void {
    const categories = this.getAll().filter(c => c.id !== id);
    this.save(categories);
  }

  private save(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
  }
}
