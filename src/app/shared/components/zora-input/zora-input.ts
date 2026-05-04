import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zora-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: AbstractControl | null;
  @Input() iconSvg?: string;
  @Input() inputClass: string = '';
  @Input() containerClass: string = 'form-group mb-3';
  @Input() hideLabel: boolean = false;
  @Input() isTextArea: boolean = false;
  @Input() rows: number = 3;

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

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.onTouch();
  }

  onCheckboxChange(event: Event) {
    const val = (event.target as HTMLInputElement).checked;
    this.value = val;
    this.onChange(val);
    this.onTouch();
  }

  get isInvalid() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }
}