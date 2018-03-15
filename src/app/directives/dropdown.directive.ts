import { Directive, HostBinding, HostListener, OnDestroy } from '@angular/core';

import { ListenerService } from '../services/listener.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnDestroy{

  listenerSubs:Subscription;
  clicked = false;

  @HostBinding('class.open') isOpen = false;

  constructor(private listener:ListenerService){}

  ngOnDestroy(){
    if(this.listenerSubs){
      this.unsetListener();
    }
  }

  @HostListener('click', ['$event']) toggleOpen(event){
    this.setListener(event.target);
    this.clicked = true;
  }
  setListener(target){
    this.listenerSubs = this.listener.clickEvent.subscribe((event)=>{
     if(target === event.target){
       this.isOpen = !this.isOpen;
     }else{
       this.isOpen = false;
       this.unsetListener();
     }
    });
  }
  unsetListener(){
    this.listenerSubs.unsubscribe();
  }
}
