import { Component, HostListener, OnInit } from '@angular/core';

import { ListenerService } from './services/listener.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private listener: ListenerService,
              private auth: AuthService){}

  ngOnInit(){
    this.auth.getCredentials().subscribe((credentials)=>{
      if(credentials){
        console.log(credentials);
      }else{
        console.log('invalid!');
      }
    },(error)=>console.log(error));
  }

  @HostListener('document:click', ['$event']) clickOut(event){
    this.listener.clickEvent.next(event);
  }

}
