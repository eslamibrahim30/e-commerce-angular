import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin-guard';
import { GuestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/products/home/home').then((m) => m.Home)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:productId',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart/cart').then((m) => m.Cart),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout/checkout').then((m) => m.Checkout),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders').then(
        (m) => m.OrdersComponent,
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.RegisterComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'account/profile',
    loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/admin-products/admin-products').then((m) => m.AdminProducts),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/admin-categories/admin-categories').then((m) => m.AdminCategories),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/admin-orders/admin-orders').then((m) => m.AdminOrders),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/admin-users/admin-users').then((m) => m.AdminUsers),
      },
    ],
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '' },
];
