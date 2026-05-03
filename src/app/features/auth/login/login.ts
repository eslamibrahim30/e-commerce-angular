import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';
  successMessage = '';
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.error = '';
    this.loading = true;

    const success = this.auth.login(this.email, this.password);

    setTimeout(() => {
      this.loading = false;

      if (success) {
        this.successMessage = 'Login successful! Redirecting...';
        const user = this.auth.getUser();
        setTimeout(() => {
          this.router.navigate([user.role === 'admin' ? '/admin' : '/profile']);
        }, 1500);
      } else {
        this.error = 'Invalid email or password. Please try again.';
      }
    }, 1000);
  }
}
