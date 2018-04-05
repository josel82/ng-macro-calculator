import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SimpleModalComponent } from 'ngx-simple-modal';

export interface ConfirmModel {
  modalTitle:string;
  modalMsg:string;
  usrInput:string;
  successBtn:string;
}
export interface ResultModel {
  usrInput: string;
}

@Component({
  selector: 'app-prompt-modal',
  templateUrl: './prompt-modal.component.html',
  styleUrls: ['./prompt-modal.component.css']
})
export class PromptModalComponent extends SimpleModalComponent<ConfirmModel, ResultModel> implements ConfirmModel, OnInit {
  modalTitle: string;
  modalMsg: string;
  usrInput:string;
  successBtn: string;
  promptForm: FormGroup;

  constructor() {
    super();
  }
  ngOnInit(){
    this.promptForm = new FormGroup({
      'prompt': new FormControl(this.usrInput, [Validators.required,
                                                this.forbbidenChars.bind(this)])//bind is used for defining the context of this to this class
    });
  }
  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = { usrInput: this.promptForm.get('prompt').value };
    this.close();
  }

  forbbidenChars(control: FormControl):{[s:string]:boolean} {
    let regexp = new RegExp('[^A-Za-z0-9_\\s]');
    if(regexp.test(control.value)){
      return {'forbbiden': true}
    }
    return null;
  }

}
