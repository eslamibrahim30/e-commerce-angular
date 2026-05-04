import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zora-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './zora-select.html',
  styleUrl: './zora-select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZoraSelectComponent),
      multi: true
    }
  ]
})
export class ZoraSelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = 'Select option';
  @Input() options: {label: string, value: any}[] = [];
  @Input() control!: AbstractControl | null;
  @Input() containerClass: string = 'form-group mb-3';
  @Input() hideLabel: boolean = false;

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value !== undefined ? value : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
    this.onTouch();
  }
}
