import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../../../shared/components/admin-sidebar.component/admin-sidebar.component';
import { ZoraInputComponent } from '../../../../shared/components/zora-input/zora-input';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar, ZoraInputComponent],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers {
  userService = inject(UserService);
  searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

  // Filter state
  searchQuery = signal('');
  roleFilter = signal('');
  statusFilter = signal('');
  sortBy = signal('name-asc');

  // Pagination state
  currentPage = signal(1);
  pageSize = signal(10);

  filteredUsers = computed(() => {
    let list = this.userService.getAll();
    const q = this.searchQuery().toLowerCase().trim();

    if (q) {
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }

    if (this.roleFilter()) {
      list = list.filter(u => u.role === this.roleFilter());
    }

    if (this.statusFilter() === 'active') {
      list = list.filter(u => !this.userService.isDisabled(u.id));
    } else if (this.statusFilter() === 'disabled') {
      list = list.filter(u => this.userService.isDisabled(u.id));
    }

    // Sort
    const sort = this.sortBy();
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'role-asc': return a.role.localeCompare(b.role);
        default: return 0;
      }
    });

    return list;
  });

  paginatedUsers = computed(() => {
    const list = this.filteredUsers();
    const size = this.pageSize();
    if (size === -1) return list;
    const start = (this.currentPage() - 1) * size;
    return list.slice(start, start + size);
  });

  totalPages = computed(() => {
    const size = this.pageSize();
    if (size === -1) return 1;
    return Math.ceil(this.filteredUsers().length / size);
  });

  onFilterChange() {
    this.currentPage.set(1);
  }

  setPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  toggle(userId: string) {
    this.userService.toggleActive(userId);
  }
}
