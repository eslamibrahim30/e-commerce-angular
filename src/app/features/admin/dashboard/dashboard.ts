import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
import { Component, ElementRef, inject, ViewChild, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { CategoryService } from '../../../core/services/category.service';
import { AdminSidebar } from '../../../shared/components/admin-sidebar.component/admin-sidebar.component';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('stockDoughnut') stockDoughnutRef!: ElementRef;
  @ViewChild('topSellingChart') topSellingChartRef!: ElementRef;
  @ViewChild('stockVsSalesChart') stockVsSalesChartRef!: ElementRef;

  private charts: any[] = [];

  constructor() {
    // Effect to auto-update charts when data changes
    effect(() => {
      // Access signals to trigger dependency tracking
      this.productService.products();
      this.orderService.orders();

      // Re-initialize charts if they already exist
      if (this.charts.length > 0) {
        this.destroyCharts();
        this.initCharts();
      }
    });
  }

  destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  get totalRevenue() { return this.orderService.totalRevenue(); }
  get orderCount() { return this.orderService.count(); }
  get pendingCount() { return this.orderService.pendingCount(); }
  get customerCount() { return this.userService.customerCount(); }
  get productCount() { return this.productService.count(); }
  get categoryCount() { return this.categoryService.count(); }
  get categories() { return this.categoryService.categories; }

  // Stock computed stats
  inStockCount() { return this.productService.getAllRaw().filter(p => p.stock > 10).length; }
  lowStockCount() { return this.productService.getAllRaw().filter(p => p.stock > 0 && p.stock <= 10).length; }
  outOfStockCount() { return this.productService.getAllRaw().filter(p => p.stock === 0).length; }

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

  get recentOrders() {
    return [...this.orderService.getAll()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }

  navigateToProducts(filter?: string) {
    if (filter) {
      this.router.navigate(['/admin/products'], { queryParams: { filter } });
    } else {
      this.router.navigate(['/admin/products']);
    }
  }

  navigateToCategories() {
    this.router.navigate(['/admin/categories']);
  }

  ngAfterViewInit() {
    this.loadChartJS().then(() => {
      this.initCharts();
    });
  }

  private loadChartJS(): Promise<void> {
    return new Promise(resolve => {
      if ((window as any).Chart) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private getChartTextColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? '#B0B0B0' : '#757575';
  }

  private getChartGridColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  }

  private initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet. Retrying in 100ms...');
      setTimeout(() => this.initCharts(), 100);
      return;
    }
    this.buildBarChart();
    this.buildStockDoughnut();
    this.buildTopSellingChart();
    this.buildStockVsSalesChart();
  }

  private buildBarChart() {
    const data = this.productService.getCountByCategory();
    const textColor = this.getChartTextColor();
    const gridColor = this.getChartGridColor();

    const chart = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.categoryName),
        datasets: [{
          label: 'Products',
          data: data.map(d => d.count),
          backgroundColor: '#0B7974', // Teal from theme
          borderRadius: 8,
          barThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1E1E1E', titleColor: '#E0E0E0', bodyColor: '#E0E0E0' }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildStockDoughnut() {
    const inStock = this.inStockCount();
    const lowStock = this.lowStockCount();
    const outStock = this.outOfStockCount();

    const chart = new Chart(this.stockDoughnutRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [{
          data: [inStock, lowStock, outStock],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          cutout: '75%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
    this.charts.push(chart);
  }

  private buildTopSellingChart() {
    const textColor = this.getChartTextColor();
    const gridColor = this.getChartGridColor();

    // Use pre-calculated sold data from ProductService
    const topSales = [...this.productService.products()]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map(p => ({ name: p.name, qty: p.sold }));

    const chart = new Chart(this.topSellingChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: topSales.map(s => s.name),
        datasets: [{
          label: 'Units Sold',
          data: topSales.map(s => s.qty),
          backgroundColor: '#D4AF37', // Gold from theme
          borderRadius: 4,
          indexAxis: 'y'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1E1E1E', titleColor: '#E0E0E0', bodyColor: '#E0E0E0' }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildStockVsSalesChart() {
    const textColor = this.getChartTextColor();
    const gridColor = this.getChartGridColor();

    const categories = this.categoryService.getAll();
    const products = this.productService.getAllRaw();

    const data = categories.map(cat => {
      const catProducts = products.filter(p => p.categoryId === cat.id);
      const remainingStock = catProducts.reduce((sum, p) => sum + p.stock, 0);
      const unitsSold = catProducts.reduce((sum, p) => sum + p.sold, 0);

      return { name: cat.name, remainingStock, unitsSold };
    }).slice(0, 6);

    const chart = new Chart(this.stockVsSalesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [
          {
            label: 'Stock',
            data: data.map(d => d.remainingStock),
            backgroundColor: '#0B7974',
            borderRadius: 4
          },
          {
            label: 'Sold',
            data: data.map(d => d.unitsSold),
            backgroundColor: '#D4AF37',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: textColor, boxWidth: 12, padding: 20, font: { size: 11 } }
          },
          tooltip: { backgroundColor: '#1E1E1E', titleColor: '#E0E0E0', bodyColor: '#E0E0E0' }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
    this.charts.push(chart);
  }
}
