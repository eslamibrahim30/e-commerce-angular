import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.user);
    this.router.navigate(['/login']);
  }
}
