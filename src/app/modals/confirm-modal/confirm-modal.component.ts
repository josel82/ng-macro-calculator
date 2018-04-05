import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

export interface ConfirmModel {
  modalTitle:string;
  modalMsg:string;
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent extends SimpleModalComponent<ConfirmModel, boolean> implements ConfirmModel{
  modalTitle:string;
  modalMsg:string;

  constructor() {
    super();
  }

  confirm(){
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = true;
    this.close();
  }

}
