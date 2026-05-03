import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { SEED_USERS } from '../../shared/data/seed.data';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = signal<User[]>(this.loadUsers());
  private _disabledUserIds = signal<Set<string>>(new Set());

  readonly users = computed(() => this._users());
  
  readonly customerCount = computed(() => 
    this._users().filter(u => u.role === 'customer').length
  );

  constructor() {}

  private loadUsers(): User[] {
    // In a real app, this would come from an API
    return SEED_USERS;
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
