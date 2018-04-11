import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { ListenerService } from '../services/listener.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private loggedIn: boolean;

  constructor(private auth: AuthService, private listener: ListenerService) { }

  async ngOnInit() {
    const credentials = await this.auth.getCredentials();
    this.loggedIn = credentials ? true : false;
    this.listener.isLoggedIn.subscribe((resp)=>{
      this.loggedIn = resp;
    });
  }

  onLogout(){
    this.auth.logoutUser();
  }
}
