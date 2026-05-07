import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../../../shared/components/admin-sidebar.component/admin-sidebar.component';
import { OrderService } from '../../../../core/services/order.service';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders {
  protected orderService = inject(OrderService);
  protected productService = inject(ProductService);

  // Expanded row state
  expandedOrderId = signal<string | null>(null);

  toggleOrder(orderId: string) {
    this.expandedOrderId.update(current => current === orderId ? null : orderId);
  }

  getProductName(productId: string): string {
    const product = this.productService.getById(productId);
    return product ? product.name : productId;
  }

  getShippingName(shipping: any): string {
    if (shipping.name) return shipping.name;
    const first = shipping.firstName || '';
    const last = shipping.lastName || '';
    return `${first} ${last}`.trim() || '—';
  }

  getShippingAddress(shipping: any): string {
    const parts = [shipping.address, shipping.city, shipping.postalCode].filter(Boolean);
    return parts.join(', ') || '—';
  }

  getStatusBootstrapClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'Processing': return 'bg-primary-subtle text-primary-emphasis border border-primary-subtle';
      case 'Shipped': return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      case 'Delivered': return 'bg-success-subtle text-success-emphasis border border-success-subtle';
      case 'Cancelled': return 'bg-danger-subtle text-danger-emphasis border border-danger-subtle';
      default: return 'bg-light text-muted';
    }
  }

  // Filter state
  searchQuery = signal('');
  statusFilter = signal('');
  sortBy = signal('date-desc');

  // Pagination state
  currentPage = signal(1);
  pageSize = signal(10);

  allOrders = computed(() => this.orderService.getAll());

  filteredOrders = computed(() => {
    let list = this.orderService.getAll();
    const q = this.searchQuery().toLowerCase().trim();

    if (q) {
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.userId.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter()) {
      list = list.filter(o => o.status === this.statusFilter());
    }

    // Sort
    const sort = this.sortBy();
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'date-desc': return b.date.localeCompare(a.date);
        case 'date-asc': return a.date.localeCompare(b.date);
        case 'total-desc': return b.total - a.total;
        case 'total-asc': return a.total - b.total;
        case 'status-asc': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

    return list;
  });

  paginatedOrders = computed(() => {
    const list = this.filteredOrders();
    const size = this.pageSize();
    if (size === -1) return list;
    const start = (this.currentPage() - 1) * size;
    return list.slice(start, start + size);
  });

  totalPages = computed(() => {
    const size = this.pageSize();
    if (size === -1) return 1;
    return Math.ceil(this.filteredOrders().length / size);
  });

  onFilterChange() {
    this.currentPage.set(1);
  }

  setPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  updateStatus(orderId: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.orderService.updateStatus(orderId, status);
  }
}
