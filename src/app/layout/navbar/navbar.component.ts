import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  cartService = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = false;
  searchTerm: string = '';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.closeMenu(); // Ensure menu closes after logging out
    this.router.navigate(['/login']);
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchTerm.trim() } });
      this.closeMenu();
    } else {
      this.router.navigate(['/products']);
      this.closeMenu();
    }
    this.searchTerm = '';
  }
}