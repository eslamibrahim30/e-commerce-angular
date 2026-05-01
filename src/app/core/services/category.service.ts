import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import categoriesData from '../../shared/data/categories.json';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories_data';

  /** Internal writable signal — single source of truth */
  private _categories = signal<Category[]>(this.loadFromStorage());

  /** Public readonly signal for consumers */
  readonly categories = this._categories.asReadonly();

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categoriesData));
      this._categories.set(categoriesData as Category[]);
    }
  }

  /**
   * Looks up a single category by ID.
   * Returns undefined if not found.
   */
  getById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  add(category: Category): void {
    this._categories.update(cats => [...cats, category]);
    this.persist();
  }

  update(id: string, categoryData: Partial<Category>): void {
    this._categories.update(cats =>
      cats.map(c => c.id === id ? { ...c, ...categoryData } : c)
    );
    this.persist();
  }

  delete(id: string): void {
    this._categories.update(cats => cats.filter(c => c.id !== id));
    this.persist();
  }

  /** Reads initial data from localStorage */
  private loadFromStorage(): Category[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Syncs the current signal value to localStorage */
  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._categories()));
  }
}
