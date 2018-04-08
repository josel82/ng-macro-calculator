import { Directive, ElementRef, OnInit, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDinamicHeight]'
})
export class DinamicHeightDirective implements OnInit{

  @HostBinding('style.height') elementHeight;
  constructor(private element: ElementRef) { }

  ngOnInit(){
    this.elementHeight = (this.element.nativeElement.parentElement.parentElement.parentElement.clientHeight)/2+'px';
    console.log(this.element.nativeElement.parentElement.parentElement.parentElement);
    
  }

}
