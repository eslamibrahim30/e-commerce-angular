import { inject, Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { SEED_USERS } from '../../shared/data/seed.data';
import { UserService } from './user.service';
import * as CryptoJS from 'crypto-js';


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
   * login can find them immediately without delay.j
   */
  private initUsers(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const hashed = SEED_USERS.map(u => ({
        ...u,
        password: this.hashPassword(u.password)
      }));
      localStorage.setItem(this.USERS_KEY, JSON.stringify(hashed));
    }
  }

  private userService = inject(UserService);

  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');

    const hashedPassword = this.hashPassword(password);
    const user = users.find(u =>
      u.email === email && u.password === hashedPassword
    );

    if (user) {
      // Prevent disabled users from logging in
      if (this.userService.isDisabled(user.id)) {
        return false;
      }
      localStorage.setItem('session', JSON.stringify(user));
      return true;
    }

    return false;
  }

  register(userData: Omit<User, 'id'>) {
  const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  const user: User = {
    ...userData,
    id: Date.now().toString(),
    password: this.hashPassword(userData.password)  //  hash
  };

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

  private hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

}
