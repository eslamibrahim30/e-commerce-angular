import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverGlow]',
  standalone: true
})
export class HoverGlowDirective {
  @HostBinding('style.boxShadow') boxShadow: string = 'none';
  @HostBinding('style.transform') transform: string = 'scale(1)';

  @HostListener('mouseenter') onMouseEnter() {
    this.boxShadow = '0 10px 20px rgba(11, 121, 116, 0.2)';
    this.transform = 'scale(1.03)';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.boxShadow = 'none';
    this.transform = 'scale(1)';
  }
}