import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { SEED_USERS } from '../../shared/data/seed.data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users_data';

  constructor() {
    this.initUsers();
  }

  /**
   * Seeds the users into localStorage on first load so that
   * login can find them immediately without delay.
   */
  private initUsers(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(SEED_USERS));
    }
  }

  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');

    const user = users.find(u =>
      u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('session', JSON.stringify(user));
      return true;
    }

    return false;
  }

  register(userData: Omit<User, 'id'>) {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user: User = { ...userData, id: Date.now().toString() };

    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  logout() {
    localStorage.removeItem('session');
  }

  getUser(): User | null {
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
