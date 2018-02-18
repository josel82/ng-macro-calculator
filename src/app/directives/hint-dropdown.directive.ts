import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHintDropdown]'
})
export class HintDropdownDirective {

  openWithDelay:any;

  @HostBinding('class.open') isOpen = false;

  @HostListener('mouseenter') hoverOpen(){
    this.openWithDelay = setTimeout(()=>{
      this.isOpen = true;
    },1500);
  }
  @HostListener('click') clickOpen(){
    this.isOpen = !this.isOpen;
    clearTimeout(this.openWithDelay);
  }
  @HostListener('mouseleave') close(){
    this.isOpen = false;
    clearTimeout(this.openWithDelay);
  }
}
