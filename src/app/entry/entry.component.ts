import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ModalService } from '../services/modal.service';
import { ControlService } from '../services/control.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../auth/auth.service';
<<<<<<< HEAD
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
import { default as config} from './save-modal.config';

import { Entry } from '../models/entry.model';
import { FormInput } from '../shared/form-input.interface';


@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit{

  private formValues;
  private entryTitle;
  private stored: boolean = false;
  private loggedIn:boolean = true;
  // private isChanged: boolean = false;



  constructor(private stgService: StorageService,
              private modalService: ModalService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService,
<<<<<<< HEAD
              private controlService: ControlService,
              private spinnerService: Ng4LoadingSpinnerService,) { }
=======
              private controlService: ControlService) { }
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1

  ngOnInit(){
  }
  onSubmit(values){
    this.formValues = values;
  }
  setEntryTitle(title){
    this.entryTitle = title;
  }
  async onSave(){
    const credentials = await this.auth.getCredentials();
    if(!credentials){
      console.log('No Credentials!');
      this.router.navigate(['/login']);
      return;
    }
    let newEntry = this.generateReqBody(this.formValues);
    if(this.entryTitle){
      let data = this.configureSaveModal('saved', this.entryTitle);
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.title = response;
        let id = this.stgService.getItem(this.route.snapshot.params['index']).get_id();
<<<<<<< HEAD
        this.spinnerService.show();
        this.dataService.editEntry(id ,newEntry, credentials.token)
                          .then(()=>{
                            this.dataService.downloadEntries().then((resp)=>{
                              this.spinnerService.hide();
                              this.dataService.populateArray(resp.entries);
                            }).catch((error) => {
                              this.spinnerService.hide();
                              console.log('Not Authenticated.', error);
                              this.router.navigate(['/']);
                            });
=======
        this.dataService.editEntry(id ,newEntry, credentials.token)
                          .then(()=>{
                            this.dataService.downloadEntries();
                            // this.isChanged = true;
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
                            this.router.navigate(['dashboard']);
                          });
      });
    }else{
      let data = this.configureSaveModal('new', '');
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.title = response;
<<<<<<< HEAD
        this.spinnerService.show();
        this.dataService.saveEntry(newEntry, credentials.token)
                        .then(()=>{
                          this.dataService.downloadEntries().then((resp)=>{
                            this.spinnerService.hide();
                            this.dataService.populateArray(resp.entries);
                          }).catch((error) => {
                            this.spinnerService.hide();
                            console.log('Not Authenticated.', error);
                            this.router.navigate(['/']);
                          });
                          this.router.navigate(['dashboard']);
        },(error)=>{
          this.spinnerService.hide();
          let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
          this.modalService.showMsgModal(data,()=>{});
          console.log(error);
        });
=======
        this.dataService.saveEntry(newEntry, credentials.token)
                        .then(()=>{
                          this.dataService.downloadEntries();
                          // this.isChanged = false;
                          this.router.navigate(['dashboard']);
        },error=>console.log(error));
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
      });
    }
  }
  async onDelete(){
    const credentials = await this.auth.getCredentials();
    let modalData = {
      modalTitle: 'Confirm',
      modalMsg: 'Are you sure you want to delete this entry?'
    }
    this.modalService.showConfirmModal(modalData, (result)=>{
      let id = this.stgService.getItem(this.route.snapshot.params['index']).get_id();
<<<<<<< HEAD
      this.spinnerService.show();
      this.dataService.deleteEntry(id, credentials.token).then(()=>{
        this.dataService.downloadEntries().then((resp)=>{
          this.spinnerService.hide();
          this.dataService.populateArray(resp.entries);
        }).catch((error) => {
          this.spinnerService.hide();
          console.log('Not Authenticated.', error);
          this.router.navigate(['/']);
        });
        this.router.navigate(['/dashboard']);
      }).catch((error) =>{
        this.spinnerService.hide();
        let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
        this.modalService.showMsgModal(data,()=>{});
        console.log(error)
      });
=======
      this.dataService.deleteEntry(id, credentials.token).then(()=>{
        this.dataService.downloadEntries();
        this.router.navigate(['/dashboard']);
      }).catch(error => console.log(error));
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
    });
  }

  onBack(){
    let modalData = {
      modalTitle: 'Confirm',
      modalMsg: 'Do you want to leave without saving your changes?'
    }
    this.modalService.showConfirmModal(modalData, (response)=>{
      this.router.navigate(['dashboard']);
    });
  }

  onCalculate():void{
    this.controlService.calculate.next();
  }

  onClear():void{
    this.controlService.clearForm.next();
  }

  configureSaveModal(key:string, input){
    let data = {modalTitle: '', modalMsg: '', usrInput: '', successBtn: ''};
    data.modalTitle = config[key].modalTitle;
    data.modalMsg = config[key].modalMsg;
    data.successBtn = config[key].successBtn;
    data.usrInput = input;
    return data;
  }

  generateReqBody(form):FormInput{
    return {
            title: '',
            gender: +form.gender,
            age: form.age,
            weight:form.weight,
            height: form.height,
            activityMult: +form.activityMult,
            goalMult:+form.goalMult,
            isImperial: form.isImperial
          }
  }


}
