import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/products/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:productId',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart/cart').then((m) => m.Cart),
  },
  // {
  //   path: 'checkout',
  //   loadComponent: () => import('./features/checkout/checkout/checkout').then((m) => m.Checkout),
  // },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('./features/orders/order-confirmation/order-confirmation').then(
        (m) => m.OrderConfirmation,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'account/profile',
    loadComponent: () => import('./features/profile/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'admin/products',
    loadComponent: () =>
      import('./features/admin/products/admin-products/admin-products').then(
        (m) => m.AdminProducts,
      ),
  },
  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./features/admin/orders/admin-orders/admin-orders').then((m) => m.AdminOrders),
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/admin/users/admin-users/admin-users').then((m) => m.AdminUsers),
  },
  {
    path: 'admin/categories',
    loadComponent: () =>
      import('./features/admin/categories/admin-categories/admin-categories').then(
        (m) => m.AdminCategories,
      ),
  },
  { path: '**', redirectTo: '' },
];
