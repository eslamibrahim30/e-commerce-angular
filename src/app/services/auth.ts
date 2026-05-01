import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) =>
      u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('session', JSON.stringify(user));
      return true;
    }

    return false;
  }

  register(user: any) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    user.id = Date.now();

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
