import { Injectable } from '@angular/core';

import { SimpleModalService } from "ngx-simple-modal";
import { PromptModalComponent } from '../modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
<<<<<<< HEAD
import { MsgModalComponent } from '../modals/msg-modal/msg-modal.component';
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1

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

<<<<<<< HEAD
  showMsgModal(data, callback) {
    let disposable = this.simpleModalService
                            .addModal(MsgModalComponent, data)
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

=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
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
