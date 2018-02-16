import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appModal]'
})
export class ModalDirective {

  constructor() { }

  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen(){
    this.isOpen = !this.isOpen;
  }
  
}
