import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zora-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zora-table.html',
  styleUrl: './zora-table.css'
})
export class ZoraTableComponent {
  @Input() headers: string[] = []; 
  @Input() data: any[] = [];      
  @Input() isLoading: boolean = false;
  
  @Input() showActions: boolean = false;
}