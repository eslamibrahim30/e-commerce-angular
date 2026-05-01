import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'auth_session';

  /** Internal writable signal — single source of truth */
  private _session = signal<any | null>(this.loadFromStorage());

  /** Public readonly signal of the current session */
  readonly session = this._session.asReadonly();

  /** Convenient boolean signal for auth guards, navbar, etc. */
  readonly isLoggedIn = computed(() => this._session() !== null);

  login(userData: any): void {
    this._session.set(userData);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(userData));
  }

  logout(): void {
    this._session.set(null);
    localStorage.removeItem(this.SESSION_KEY);
  }

  /** Reads initial session from localStorage */
  private loadFromStorage(): any | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
}
