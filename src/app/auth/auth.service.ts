import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AsyncLocalStorage } from 'angular-async-local-storage';
import { BackendService } from '../services/backend.service';

interface AuthResponse{
  _id: string;
  email:string;
}
interface UserCredentials{
  userId: string;
  token: string;
}

@Injectable()
export class AuthService {

  constructor(private backend: BackendService,
              private localStorage: AsyncLocalStorage,
              private router: Router){}

  loginUser(input: {email:string, password: string}){
    const path = '/users/login';

    this.backend.postRequest(path, input, null).subscribe((response : HttpResponse<AuthResponse>)=>{
      let user = {
        userId: response.body._id,
        token: response.headers.get('x-auth')
      }
      this.localStorage.setItem('user', user).subscribe(()=>{});
      this.router.navigate(['/dashboard']);
    },(error)=>{
      console.log(error);
    });
  }

  logoutUser(){
    const path = '/users/me/token';
    const resType = 'text';
    this.getCredentials().subscribe((credentials)=>{
      let header = { key: 'x-auth', value: credentials.token }

      this.backend.deleteRequest(path, header, resType).subscribe((response: HttpResponse<any>)=>{
        this.localStorage.clear().subscribe(()=>{});
        this.router.navigate(['/']);
      });
    },(error)=>{
      console.log(error);
    });

  }

  signupUser(input: {email:string, password: string}){
    const path = '/users';

    this.backend.postRequest(path, input, null).subscribe((response: HttpResponse<AuthResponse>)=>{
      let user = {
        userId: response.body._id,
        token: response.headers.get('x-auth')
      }
      this.localStorage.setItem('user', user).subscribe(()=>{});
      this.router.navigate(['/dashboard']);
    },(error)=>{
      console.log(error);
    });
  }

  getCredentials(): Observable<UserCredentials>{
    return this.localStorage.getItem<{userId:string, token:string}>('user');
  }

}
