import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';

import { AsyncLocalStorage } from 'angular-async-local-storage';
import { BackendService } from '../services/backend.service';
import { UserCredentials } from './user-credentials.interface';
import { ModalService } from '../services/modal.service';
import { default as config} from './modal.config';
import { DataService } from '../services/data.service';
import { ListenerService } from '../services/listener.service';
import { SpinnerService } from '../services/spinner.service';

interface AuthResponse{
  _id: string;
  email:string;
}

@Injectable()
export class AuthService {

  constructor(private backend: BackendService,
              private localStorage: AsyncLocalStorage,
              private router: Router,
              private spinnerService: SpinnerService,
              private modalService: ModalService,
              private dataService: DataService,
              private listener: ListenerService){}

// =============================================================================
// =============================  LOG IN =======================================
// =============================================================================
  loginUser(input: {email:string, password: string}){
    const loginRoute = `${this.backend.getUrl()}/users/login`;
    const getEntRoute = `${this.backend.getUrl()}/entries`;
    this.spinnerService.show("mySpinner");
    this.backend.loginUser(loginRoute, input).subscribe((response : HttpResponse<AuthResponse>)=>{
      const user ={
        userId: response.body._id,
        token: response.headers.getAll('x-auth')
      };
      this.localStorage.setItem('user', user).subscribe(()=>{});
      this.dataService.downloadEntries(getEntRoute, user.token).then(()=>{
        this.listener.isLoggedIn.next(true);
        this.spinnerService.hide("mySpinner");
        this.router.navigate(['/dashboard']);
      }).catch((error)=>console.log(error));
      
    },(error)=>{
      console.log(error);
      this.spinnerService.hide("mySpinner");
      let key = this.errorHandler(error);
      let modalData = this.configureModal(key);
      this.modalService.showMsgModal(modalData, ()=>{});
  });
  }

  // =============================================================================
  // =============================  LOG OUT =======================================
  // =============================================================================

  async logoutUser(){
    const route = `${this.backend.getUrl()}/users/me/token`;
    const credentials = await this.getCredentials();
    if(!credentials) return this.router.navigate(['/']);
    this.spinnerService.show("mySpinner");
    this.backend.logoutUser(route, credentials.token, 'text').subscribe((response)=>{
      this.listener.isLoggedIn.next(false);
        this.spinnerService.hide("mySpinner");
        this.localStorage.clear().subscribe(()=>{});
        this.router.navigate(['/']);
      },(error)=>{
        console.log(error);
        this.spinnerService.hide("mySpinner");
        let key = this.errorHandler(error);
        this.modalService.showMsgModal(this.configureModal(key),()=>{});
      });
  }

  // =============================================================================
  // =============================  SIGN UP ======================================
  // =============================================================================
  signupUser(input: {email:string, password: string}){
      const route = `${this.backend.getUrl()}/users`;
      const getEntRoute = `${this.backend.getUrl()}/entries`;
      this.spinnerService.show("mySpinner");
      this.backend.signUpUser(route, input).subscribe((response: HttpResponse<AuthResponse>)=>{
      let user = {
        userId: response.body._id,
        token: response.headers.get('x-auth')
      };
      this.localStorage.setItem('user', user).subscribe(()=>{});
      this.dataService.downloadEntries(getEntRoute, user.token).then(()=>{
        this.listener.isLoggedIn.next(true);
        this.spinnerService.hide("mySpinner");
        this.router.navigate(['/dashboard']);
      }).catch((error)=>console.log(error));
    },(error)=>{
      console.log(error);
      this.spinnerService.hide("mySpinner");
      let key = this.errorHandler(error);
      this.modalService.showMsgModal(this.configureModal(key),()=>{});
    });
  }

  getCredentials(): Promise<any>{
    return this.localStorage.getItem<{userId:string, token:string}>('user')
                            .take(1)
                            .toPromise();
  }

  configureModal(key:string): {modalTitle:string, modalMsg:string} {
    let data = {modalTitle: '', modalMsg: ''};
    data.modalTitle = config[key].modalTitle;
    data.modalMsg = config[key].modalMsg;
    return data;
  }

  errorHandler(error): string{
    let key: string;
    if(error.status === 500){
      key = 'failure';
    }else if(error.status === 401){
      key = 'invalidCredential';
    }else if(error.status === 400){
      switch(error.error.type){
        case 'password':
          key ='invalidPassword';
          break;
        case 'account':
          key = 'userDupl';
          break;
        case 'email':
          key = 'invalidEmail';
          break;
        case 'auth':
          key = 'authError';
          break;
        default:
          key = 'error';
          return key;
      }
    }else{
      key = 'error';
    }
    return key;
  }

}
