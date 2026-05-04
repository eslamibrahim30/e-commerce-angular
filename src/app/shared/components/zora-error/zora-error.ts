import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zora-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-box animate__animated animate__shakeX">
      <i class="fas fa-exclamation-circle error-icon"></i>
      <div class="error-content">
        <h6 class="m-0 font-weight-bold">Oops! Something went wrong</h6>
        <p class="small mb-0">{{ message }}</p>
      </div>
      @if (showRetry) {
        <button class="btn btn-sm btn-outline-danger shadow-sm" (click)="onRetry.emit()">
          Retry Again
        </button>
      }
    </div>
  `,
  styleUrls: ['./zora-error.css']
})
export class ZoraErrorComponent {
  @Input() message: string = 'Unable to load data. Please check your connection.';
  @Input() showRetry: boolean = true;
  @Output() onRetry = new EventEmitter<void>();
}