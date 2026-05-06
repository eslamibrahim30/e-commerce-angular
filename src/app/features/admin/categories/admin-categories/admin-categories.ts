import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../../../shared/components/admin-sidebar.component/admin-sidebar.component';
import { ZoraTableComponent } from '../../../../shared/components/zora-table/zora-table';
import { CategoryService } from '../../../../core/services/category.service';
import { ProductService } from '../../../../core/services/product.service';
import { Category } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar, ZoraTableComponent],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories {
  protected categoryService = inject(CategoryService);
  protected productService = inject(ProductService);

  // Filter & Search state
  searchQuery = signal('');
  sortBy = signal('name-asc');

  // Pagination state
  currentPage = signal(1);
  pageSize = signal(10);

  categories = this.categoryService.categories;

  filteredCategories = computed(() => {
    let list = this.categoryService.getAll();
    const q = this.searchQuery().toLowerCase().trim();

    // Search
    if (q) {
      list = list.filter((c: Category) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // Sort
    const sort = this.sortBy();
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'id-asc': return a.id.localeCompare(b.id);
        case 'id-desc': return b.id.localeCompare(a.id);
        case 'count-asc': return this.getProductCount(a.id) - this.getProductCount(b.id);
        case 'count-desc': return this.getProductCount(b.id) - this.getProductCount(a.id);
        default: return 0;
      }
    });

    return list;
  });

  paginatedCategories = computed(() => {
    const list = this.filteredCategories();
    const size = this.pageSize();
    if (size === -1) return list;
    const start = (this.currentPage() - 1) * size;
    return list.slice(start, start + size);
  });

  totalPages = computed(() => {
    const size = this.pageSize();
    if (size === -1) return 1;
    return Math.ceil(this.filteredCategories().length / size);
  });

  // UI state
  showFormModal = false;
  showDeleteModal = false;
  editingId: string | null = null;
  deletingCategory: Category | null = null;
  deleteBlocked = false;
  formError = '';

  form = { name: '', description: '' };

  onFilterChange() {
    this.currentPage.set(1);
  }

  setPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  getProductCount(categoryId: string): number {
    return this.productService.getByCategory(categoryId).length;
  }

  openAddModal() {
    this.form = { name: '', description: '' };
    this.editingId = null;
    this.formError = '';
    this.showFormModal = true;
  }

  openEditModal(cat: Category) {
    this.form = { name: cat.name, description: cat.description };
    this.editingId = cat.id;
    this.formError = '';
    this.showFormModal = true;
  }

  openDeleteModal(cat: Category) {
    this.deletingCategory = cat;
    this.deleteBlocked = this.getProductCount(cat.id) > 0;
    this.showDeleteModal = true;
  }

  closeModal() {
    this.showFormModal = false;
    this.editingId = null;
  }

  saveCategory() {
    this.formError = '';
    if (!this.form.name.trim()) { this.formError = 'Category name is required.'; return; }

    const payload = { name: this.form.name.trim(), description: this.form.description.trim() };
    if (this.editingId) {
      this.categoryService.update(this.editingId, payload);
    } else {
      this.categoryService.add({ ...payload, id: `cat-${Date.now()}` });
    }
    this.closeModal();
  }

  confirmDeleteCategory() {
    if (this.deletingCategory) {
      this.categoryService.delete(this.deletingCategory.id);
      this.showDeleteModal = false;
      this.deletingCategory = null;
    }
  }
}
