import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  onLogout(){
    this.auth.logoutUser();
  }
}
