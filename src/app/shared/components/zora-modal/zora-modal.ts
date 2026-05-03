import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zora-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zora-modal.html',
  styleUrl: './zora-modal.css'
})
export class ZoraModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Notification'; 
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) this.close();
  }

  confirm() {
    this.confirmed.emit();
    this.isOpen = false;
  }

  close(event?: any) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.canceled.emit();
  }
}