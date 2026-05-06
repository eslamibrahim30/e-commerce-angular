import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-zora-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zora-select.html',
  styleUrl: './zora-select.css',
  template: `
    <div class="form-group mb-3">
      <label class="form-label font-weight-bold text-secondary">{{ label }}</label>
      <select [formControl]="$any(control)" class="form-control zora-form-control" [class.is-invalid]="control?.invalid && control?.touched">
        <option value="" disabled selected>{{ placeholder }}</option>
        @for (opt of options; track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>
      @if (control?.invalid && control?.touched) {
        <div class="invalid-feedback">Please select an item from the list.</div>
      }
    </div>
  `
})
export class ZoraSelectComponent {
  @Input() label!: string;
  @Input() placeholder: string = 'Select option';
  @Input() options: {label: string, value: any}[] = [];
  @Input() control!: AbstractControl | null;
}
