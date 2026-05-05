import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    effect(() => {
      if (this.isDarkMode()) {
        this.applyDark();
      } else {
        this.applyLight();
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  private applyDark() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-bs-theme', 'dark'); 
  }

  private applyLight() {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}