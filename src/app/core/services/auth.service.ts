import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: User) =>
      u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('session', JSON.stringify(user));
      return true;
    }

    return false;
  }

  register(userData: Omit<User, 'id'>) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user: User = { ...userData, id: Date.now().toString() };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  logout() {
    localStorage.removeItem('session');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('session') || 'null');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('session');
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}
