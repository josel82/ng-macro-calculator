import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';

import { SimpleModalComponent } from 'ngx-simple-modal';

export interface ConfirmModel {
  modalTitle:string;
  modalMsg:string;
  entryTitle:string;
  successBtn:string;
}
export interface ResultModel {
  inputTitle: string;
}

@Component({
  selector: 'app-prompt-modal',
  templateUrl: './prompt-modal.component.html',
  styleUrls: ['./prompt-modal.component.css']
})
export class PromptModalComponent extends SimpleModalComponent<ConfirmModel, ResultModel> implements ConfirmModel, OnInit {
  modalTitle: string;
  modalMsg: string;
  entryTitle:string;
  successBtn: string;
  @ViewChild('input') input: ElementRef;

  constructor() {
    super();
  }
  ngOnInit(){
    this.input.nativeElement.value = this.entryTitle;
  }
  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = { inputTitle: this.input.nativeElement.value };
    this.close();
  }

}
