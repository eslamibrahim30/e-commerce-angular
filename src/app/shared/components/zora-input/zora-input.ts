import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-zora-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './zora-input.html',
  styleUrl: "./zora-input.css",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZoraInputComponent),
      multi: true
    }
  ]
})
export class ZoraInputComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: AbstractControl | null;
  @Input() isInvalid: boolean = false;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  get checkInvalid() {
    if (this.control) {
      return !!(this.control.invalid && (this.control.dirty || this.control.touched));
    }
    return this.isInvalid;
  }

  writeValue(value: any): void { this.value = value; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}