import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  expanded: boolean=false
  orders = signal([
  {
    id: 101,
    date: '2026-04-30',
    total: 120,
    expanded: false,
    items: [
      { id: 1, name: 'Laptop', price: 100, quantity: 1, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500' },
      { id: 2, name: 'Mouse', price: 20, quantity: 1, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500' }
    ]
  },
  {
    id: 102,
    date: '2026-04-25',
    total: 80,
    expanded: false,
    items: [
      { id: 3, name: 'Headphones', price: 80, quantity: 1, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500' }
    ]
  }
])
toggleOrder(id: number) {
  this.orders.update(orders =>
    orders.map(order =>
      order.id === id
        ? { ...order, expanded: !order.expanded }
        : order
    )
  )
}
}
