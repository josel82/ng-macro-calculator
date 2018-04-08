import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { ListenerService } from './services/listener.service';
import { AuthService } from './auth/auth.service';
import { DataService } from './services/data.service';
import { StorageService } from './services/storage.service';

import { UserCredentials } from './auth/user-credentials.interface';
import { BackendService } from './services/backend.service';

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
              private router: Router, 
              private backend: BackendService){}

  async ngOnInit(){
    this.auth.getCredentials().then((credentials)=>{
      if(credentials){
        const route = `${this.backend.getUrl()}/entries`;
        this.dataService.downloadEntries(route, credentials.token)
                            .then(()=>{})
                            .catch((error)=>{
                                console.log(error); // log error
                                this.router.navigate(['/']); // navigate away
                            });
      }
  
    });

  }

  @HostListener('document:click', ['$event']) clickOut(event){
    this.listener.clickEvent.next(event);
  }

}
