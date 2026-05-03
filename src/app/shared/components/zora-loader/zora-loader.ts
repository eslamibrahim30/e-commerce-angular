import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zora-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" [class.full-screen]="fullScreen">
      <div class="zora-spinner"></div>
      @if (message) {
        <p class="mt-3 loader-text">{{ message }}</p>
      }
    </div>
  `,
  styleUrls: ['./zora-loader.css']
})
export class ZoraLoaderComponent {
  @Input() fullScreen: boolean = false;
  @Input() message: string = 'Loading...';
}