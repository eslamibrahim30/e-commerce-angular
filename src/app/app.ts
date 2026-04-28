import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCard } from "./components/product-card/product-card";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('e-commerce-angular');

  handleAddToCart(product: any) {
  alert(`Added ${product.title} to cart! Check your console.`);
  console.log('Product Data:', product);
}
}
