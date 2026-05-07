import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
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
  loading = signal(false);
  successMessage = signal('');
  memberSince = '';

  constructor(private auth: AuthService, private userService: UserService) { }

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
    if (!this.user) return;

    this.loading.set(true);
    this.successMessage.set('');

    try {
      let usersData = localStorage.getItem('users_data');
      let users: any[] = JSON.parse(usersData || '[]');

      const index = users.findIndex(u => u.id === this.user.id);
      if (index !== -1) {
        users[index] = { ...this.user }; // Update the user in the array
        localStorage.setItem('users_data', JSON.stringify(users));
        localStorage.setItem('session', JSON.stringify(this.user));
        this.userService.refresh(); // Sync the signal so admin table reflects changes

        setTimeout(() => {
          this.loading.set(false);
          this.successMessage.set('Changes saved successfully!');

          setTimeout(() => this.successMessage.set(''), 3000);
        }, 800);

      } else {
        this.loading.set(false);
        console.error('User not found in localStorage');
      }
    } catch (error) {
      this.loading.set(false);
      console.error('Update failed:', error);
    }
  }
}
