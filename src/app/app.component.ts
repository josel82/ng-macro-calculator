import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { ListenerService } from './services/listener.service';
import { AuthService } from './auth/auth.service';
import { DataService } from './services/data.service';
import { StorageService } from './services/storage.service';

import { UserCredentials } from './auth/user-credentials.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private listener: ListenerService,
              private auth: AuthService,
              private dataService: DataService,
              private storage: StorageService,
              private router: Router){}

  ngOnInit(){
    this.dataService.downloadEntries();
  //   this.dataService.getEntries().then((resp)=>{
  //     this.dataService.populateArray(resp.entries);
  //   }).catch((error) => {
  //     console.log('Not Authenticated.',error);
  //   });
  }

  @HostListener('document:click', ['$event']) clickOut(event){
    this.listener.clickEvent.next(event);
  }

}
