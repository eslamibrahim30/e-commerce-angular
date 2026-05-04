import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../../../shared/components/admin-sidebar.component/admin-sidebar.component';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ProductDisplay } from '../../../../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ZoraTableComponent } from '../../../../shared/components/zora-table/zora-table';
import { ZoraInputComponent } from '../../../../shared/components/zora-input/zora-input';
import { ZoraModalComponent } from '../../../../shared/components/zora-modal/zora-modal';
import { ZoraSelectComponent } from '../../../../shared/components/zora-select/zora-select';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar, ZoraTableComponent, ZoraInputComponent, ZoraModalComponent, ZoraSelectComponent],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit {
  protected productService = inject(ProductService);
  protected categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

  // Search & Filter state
  searchQuery = signal('');
  selectedCategory = signal('');
  stockFilter = signal('');
  sortBy = signal('name-asc');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.stockFilter.set(params['filter']);
      }
    });
  }

  // Pagination state
  currentPage = signal(1);
  pageSize = signal(10);

  categories = this.categoryService.categories;
  categoryOptions = computed(() => this.categories().map(c => ({ label: c.name, value: c.id })));

  // Filtered and Sorted list
  filteredProducts = computed(() => {
    let list = this.productService.getAllDisplay();
    const q = this.searchQuery().toLowerCase().trim();

    // Search
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (this.selectedCategory()) {
      list = list.filter(p => p.categoryId === this.selectedCategory());
    }

    // Stock Filter
    const sFilter = this.stockFilter();
    if (sFilter === 'instock') list = list.filter(p => p.stock > 10);
    else if (sFilter === 'low') list = list.filter(p => p.stock > 0 && p.stock <= 10);
    else if (sFilter === 'out') list = list.filter(p => p.stock === 0);

    // Sorting
    const sort = this.sortBy();
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'stock-asc': return a.stock - b.stock;
        case 'stock-desc': return b.stock - a.stock;
        default: return 0;
      }
    });

    return list;
  });

  // Final Paginated list
  paginatedProducts = computed(() => {
    const list = this.filteredProducts();
    const size = this.pageSize();
    if (size === -1) return list; // "All" option
    const start = (this.currentPage() - 1) * size;
    return list.slice(start, start + size);
  });

  totalPages = computed(() => {
    const size = this.pageSize();
    if (size === -1) return 1;
    return Math.ceil(this.filteredProducts().length / size);
  });

  // UI state
  showFormModal = false;
  showDeleteModal = false;
  editingId: string | null = null;
  deletingProduct: ProductDisplay | null = null;
  formError = '';

  form = this.emptyForm();

  private emptyForm() {
    return { name: '', price: 0, oldPrice: undefined as number | undefined, categoryId: '', description: '', image: '', stock: 0, isFeatured: false };
  }

  // Reset pagination on filter change
  onFilterChange() {
    this.currentPage.set(1);
  }

  setPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock <= 10) return 'stock-low';
    return 'stock-ok';
  }

  getStockBootstrapClass(stock: number): string {
    if (stock <= 0) return 'bg-danger-subtle text-danger';
    if (stock <= 10) return 'bg-warning-subtle text-warning-emphasis';
    return 'bg-success-subtle text-success';
  }

  openAddModal() {
    this.form = this.emptyForm();
    this.editingId = null;
    this.formError = '';
    this.showFormModal = true;
  }

  openEditModal(p: ProductDisplay) {
    this.form = { name: p.name, price: p.price, oldPrice: p.oldPrice, categoryId: p.categoryId, description: p.description, image: p.image, stock: p.stock, isFeatured: !!p.isFeatured };
    this.editingId = p.id;
    this.formError = '';
    this.showFormModal = true;
  }

  openDeleteModal(p: ProductDisplay) {
    this.deletingProduct = p;
    this.showDeleteModal = true;
  }

  closeModal() {
    this.showFormModal = false;
    this.editingId = null;
  }

  saveProduct() {
    this.formError = '';
    if (!this.form.name.trim()) { this.formError = 'Product name is required.'; return; }
    if (!this.form.categoryId) { this.formError = 'Please select a category.'; return; }
    if (this.form.price <= 0) { this.formError = 'Price must be greater than 0.'; return; }

    const payload = {
      name: this.form.name.trim(),
      price: +this.form.price,
      oldPrice: this.form.oldPrice ? +this.form.oldPrice : undefined,
      categoryId: this.form.categoryId,
      description: this.form.description.trim(),
      image: this.form.image.trim() || 'https://placehold.co/400x300?text=Product',
      stock: +this.form.stock,
      isFeatured: this.form.isFeatured,
    };

    if (this.editingId) {
      this.productService.update(this.editingId, payload);
    } else {
      this.productService.add({ ...payload, id: `p-${Date.now()}` });
    }
    this.closeModal();
  }

  confirmDelete() {
    if (this.deletingProduct) {
      this.productService.delete(this.deletingProduct.id);
      this.showDeleteModal = false;
      this.deletingProduct = null;
    }
  }
}
