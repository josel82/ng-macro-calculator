import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private signUpForm: FormGroup;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.signUpForm = this.initialiseForm();
  }

  initialiseForm():FormGroup{
    return new FormGroup({
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSignUp(){
    this.auth.signupUser(this.signUpForm.value);
  }

}
