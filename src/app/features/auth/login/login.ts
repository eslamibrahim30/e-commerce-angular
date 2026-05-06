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
  this.successMessage = '';

  const success = this.auth.login(this.email, this.password);

  
  if (!success) {
    this.error = 'Invalid email or password. Please try again.';
    this.loading = false;
    return;
  }


  this.loading = true;
  this.successMessage = 'Login successful! Redirecting...';

  const user = this.auth.getUser();

  setTimeout(() => {
    this.loading = false;
    this.router.navigate([user?.role === 'admin' ? '/admin' : '/profile']);
  }, 1000);
}

}
