import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';

import { AsyncLocalStorage } from 'angular-async-local-storage';
import { BackendService } from '../services/backend.service';
import { UserCredentials } from './user-credentials.interface';
<<<<<<< HEAD
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ModalService } from '../services/modal.service';
import { default as config} from './modal.config';
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1

interface AuthResponse{
  _id: string;
  email:string;
}

@Injectable()
export class AuthService {

  constructor(private backend: BackendService,
              private localStorage: AsyncLocalStorage,
<<<<<<< HEAD
              private router: Router,
              private spinnerService: Ng4LoadingSpinnerService,
              private modalService: ModalService){}

// =============================================================================
// =============================  LOG IN =======================================
// =============================================================================
  loginUser(input: {email:string, password: string}){
    const path = '/users/login';
    this.spinnerService.show();
=======
              private router: Router){}

  loginUser(input: {email:string, password: string}){
    const path = '/users/login';

>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
    this.backend.postRequest(path, input, null).subscribe((response : HttpResponse<AuthResponse>)=>{
      let user = {
        userId: response.body._id,
        token: response.headers.get('x-auth')
      }
      this.localStorage.setItem('user', user).subscribe(()=>{
        this.router.navigate(['/dashboard']);
      });
<<<<<<< HEAD
      this.spinnerService.hide();
    },(error)=>{
      console.log(error);
      this.spinnerService.hide();
      let key = this.errorHandler(error);
      let modalData = this.configureModal(key);
      this.modalService.showMsgModal(modalData, ()=>{});
    });
  }

  // =============================================================================
  // =============================  LOG OUT =======================================
  // =============================================================================

=======

    },(error)=>{
      console.log(error);
    });
  }

>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
  async logoutUser(){
    const path = '/users/me/token';
    const resType = 'text';
    const credentials = await this.getCredentials();
    let header = { key: 'x-auth', value: credentials.token }
<<<<<<< HEAD
    this.spinnerService.show();
    this.backend.deleteRequest(path, header, resType).subscribe((response: HttpResponse<any>)=>{
      this.spinnerService.hide();
      this.localStorage.clear().subscribe(()=>{
        this.router.navigate(['/']);
      });
    },(error)=>{
      console.log(error);
      this.spinnerService.hide();
      let key = this.errorHandler(error);
      this.modalService.showMsgModal(this.configureModal(key),()=>{});
    });
  }

  // =============================================================================
  // =============================  SIGN UP ======================================
  // =============================================================================
  signupUser(input: {email:string, password: string}){
    const path = '/users';
    this.spinnerService.show();
=======

    this.backend.deleteRequest(path, header, resType).subscribe((response: HttpResponse<any>)=>{
      this.localStorage.clear().subscribe(()=>{
        this.router.navigate(['/']);
      });
    });
  }

  signupUser(input: {email:string, password: string}){
    const path = '/users';

>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
    this.backend.postRequest(path, input, null).subscribe((response: HttpResponse<AuthResponse>)=>{
      let user = {
        userId: response.body._id,
        token: response.headers.get('x-auth')
      }
<<<<<<< HEAD
      this.spinnerService.hide();
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
      this.localStorage.setItem('user', user).subscribe(()=>{});
      this.router.navigate(['/dashboard']);
    },(error)=>{
      console.log(error);
<<<<<<< HEAD
      this.spinnerService.hide();
      let key = this.errorHandler(error);
      this.modalService.showMsgModal(this.configureModal(key),()=>{});
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
    });
  }

  getCredentials(): Promise<UserCredentials>{
    return this.localStorage.getItem<{userId:string, token:string}>('user')
                            .take(1)
                            .toPromise()
                            .catch(error=> console.log(error));
  }

<<<<<<< HEAD
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

=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
}
