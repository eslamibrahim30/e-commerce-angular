import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

@Directive({
  selector: '[appZoraBtn]',
  standalone: true
})
export class ZoraBtnDirective implements OnChanges {
  @Input() loading: boolean = false;
  
  private originalContent: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'btn');
    this.renderer.addClass(this.el.nativeElement, 'btn-zora-gold');
    this.renderer.addClass(this.el.nativeElement, 'position-relative');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading']) {
      this.toggleLoading();
    }
  }

  private toggleLoading() {
    const button = this.el.nativeElement;

    if (this.loading) {
      this.originalContent = button.innerHTML;
      this.renderer.setAttribute(button, 'disabled', 'true');
      
      button.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="ml-2">جاري التحميل...</span>
      `;
    } else {
      if (this.originalContent) {
        button.innerHTML = this.originalContent;
      }
      this.renderer.removeAttribute(button, 'disabled');
    }
  }
}