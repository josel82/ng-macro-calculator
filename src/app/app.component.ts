import { Component, HostListener } from '@angular/core';

import{ ListenerService } from './services/listener.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private listener: ListenerService){}
  @HostListener('document:click', ['$event']) clickOut(event){
    this.listener.clickEvent.next(event);
  }

}
