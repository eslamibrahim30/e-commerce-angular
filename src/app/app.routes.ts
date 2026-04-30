import { Routes } from '@angular/router';

export const routes: Routes = [
  {path:'cart',loadComponent:()=>import('./features/orders/cart/cart').then((c)=>c.Cart),canActivate:[]},
  {path:'checkout',loadComponent:()=>import('./features/orders/checkout/checkout').then((c)=>c.Checkout),canActivate:[]},
  {path:'orders',loadComponent:()=>import('./features/orders/orders/orders').then((c)=>c.Orders),canActivate:[]},
];
