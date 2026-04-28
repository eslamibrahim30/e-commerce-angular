import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'auth_session';

  constructor() {}

  login(userData: any): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(userData));
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  checkSession(): any | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
}
