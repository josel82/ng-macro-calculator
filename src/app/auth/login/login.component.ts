import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.initialiseForm();
  }

  initialiseForm():FormGroup{
    return new FormGroup({
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onLogin(){
    this.auth.loginUser(this.loginForm.value);
  }


}
