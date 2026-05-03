import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-zora-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zora-input.html',
  styleUrl: "./zora-input.css",
})
export class ZoraInputComponent {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: AbstractControl | null;

  get isInvalid() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }
}