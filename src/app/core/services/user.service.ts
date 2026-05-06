import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'users_data';

  private _users = signal<User[]>(this.loadUsers());
  private _disabledUserIds = signal<Set<string>>(new Set());

  readonly users = computed(() => this._users());
  
  readonly customerCount = computed(() => 
    this._users().filter(u => u.role === 'customer').length
  );

  constructor() {}

  private loadUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Refresh the signal from localStorage (e.g. after AuthService seeds data) */
  refresh(): void {
    this._users.set(this.loadUsers());
  }

  /** Add a new user to the signal and persist to localStorage */
  addUser(user: User): void {
    this._users.update(users => [...users, user]);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this._users()));
  }

  getAll() {
    return this.users();
  }

  isDisabled(userId: string): boolean {
    return this._disabledUserIds().has(userId);
  }

  toggleActive(userId: string) {
    this._disabledUserIds.update(set => {
      const newSet = new Set(set);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }

  update(id: string, userData: Partial<User>) {
    this._users.update(users => 
      users.map(u => u.id === id ? { ...u, ...userData } : u)
    );
  }
}

