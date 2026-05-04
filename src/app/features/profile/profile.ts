import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  user!: User;
  loading = false;
  successMessage = '';
  memberSince = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser() ?? { id: '', name: '', email: '', password: '', role: 'customer' };
    this.memberSince = new Date().toLocaleDateString('en-US', {
      month: 'long', year: 'numeric'
    });
  }

  getInitials(name: string): string {
    return name.trim().split(' ')
      .map(w => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('');
  }

  update() {
    this.loading = true;
    this.successMessage = '';

    setTimeout(() => {
      let users: User[] = JSON.parse(localStorage.getItem('users_data') || '[]');
      users = users.map(u => u.id === this.user.id ? this.user : u);
      localStorage.setItem('users_data', JSON.stringify(users));
      localStorage.setItem('session', JSON.stringify(this.user));

      this.loading = false;
      this.successMessage = 'Changes saved successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    }, 900);
  }
}
