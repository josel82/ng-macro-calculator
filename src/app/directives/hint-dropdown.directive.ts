import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHintDropdown]'
})
export class HintDropdownDirective {

  openWithDelay:any;

  @HostBinding('class.open') isOpen = false;

  @HostListener('mouseenter') open(){
    this.openWithDelay = setTimeout(()=>{
      this.isOpen = true;
    },2000);
  }
  @HostListener('click') @HostListener('mouseleave') close(){
    this.isOpen = false;
    clearTimeout(this.openWithDelay);
  }
}
