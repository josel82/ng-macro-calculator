import { Injectable } from '@angular/core';

import { SimpleModalService } from "ngx-simple-modal";
import { PromptModalComponent } from '../modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';

@Injectable()
export class ModalService {

  constructor(private simpleModalService:SimpleModalService) { }

  showPromptModal(data, callback) {
    let disposable = this.simpleModalService
                            .addModal(PromptModalComponent, data)
                              .subscribe((result)=>{
                                  //We get modal result
                                  if(result) {
                                     callback(result.usrInput);
                                  }
                              });
            //We can close modal calling disposable.unsubscribe();
            //If modal was not closed manually close it by timeout
            setTimeout(()=>{
                disposable.unsubscribe();
            },60000);
  }

  showConfirmModal(data:{modalTitle:string, modalMsg:string}, callback){

    let disposable = this.simpleModalService
                            .addModal(ConfirmModalComponent, data)
                              .subscribe((result)=>{
                                  //We get modal result
                                  if(result) {
                                     callback(result);
                                  }
                              });
            //We can close modal calling disposable.unsubscribe();
            //If modal was not closed manually close it by timeout
            setTimeout(()=>{
                disposable.unsubscribe();
            },60000);
  }

}
