import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkMode.set(true);
      this.applyDark();
    }
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      this.applyDark();
      localStorage.setItem('theme', 'dark');
    } else {
      this.applyLight();
      localStorage.setItem('theme', 'light');
    }
  }

  private applyDark() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }

  private applyLight() {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-bs-theme');
  }
}
