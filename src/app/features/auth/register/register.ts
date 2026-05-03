import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators, AbstractControl
} from '@angular/forms';

function passwordMatch(group: AbstractControl) {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  loading = false;
  showPassword = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name:            ['', [Validators.required, Validators.minLength(3)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['',  Validators.required]
    }, { validators: passwordMatch });
  }

  isInvalid(field: string) {
    const c = this.registerForm.get(field);
    return c?.invalid && c?.touched;
  }

  isValid(field: string) {
    const c = this.registerForm.get(field);
    return c?.valid && c?.touched;
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  get passwordStrength(): number {
    const v = this.registerForm.get('password')?.value ?? '';
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  }

  getBarClass(index: number): string {
    const s = this.passwordStrength;
    const base = 'strength-bar flex-fill';
    if (index > s) return base;
    return base + (s <= 1 ? ' bg-danger' : s <= 2 ? ' bg-warning' : ' bg-success');
  }

  get strengthLabel() {
    return ['Very weak', 'Weak', 'Fair', 'Strong'][Math.max(0, this.passwordStrength - 1)];
  }

  get strengthColor() {
    const s = this.passwordStrength;
    return s <= 1 ? '#dc3545' : s <= 2 ? '#e09c00' : '#198754';
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { name, email, password } = this.registerForm.value;
    this.auth.register({ name, email, password, role:'customer'  });
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Account created successfully! Redirecting...';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    }, 1200);
  }
}
