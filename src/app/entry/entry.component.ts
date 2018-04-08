import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ModalService } from '../services/modal.service';
import { ControlService } from '../services/control.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../auth/auth.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { default as config} from './save-modal.config';

import { Entry } from '../models/entry.model';
import { FormInput } from '../shared/form-input.interface';
import { BackendService } from '../services/backend.service';


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
              private controlService: ControlService,
              private spinnerService: Ng4LoadingSpinnerService,
              private backend: BackendService) { }

  async ngOnInit(){
    const credentials = await this.auth.getCredentials();
    this.loggedIn = credentials ? true : false;
  }

  onSubmit(values){ // Sets the values of the form ======================================================>
    this.formValues = values;
  }

  setEntryTitle(title){ // Sets the title of the entry ==================================================>
    this.entryTitle = title;
  }

  // For both save and editing an entry =================================================================>
  async onSave(){ 
    const credentials = await this.auth.getCredentials(); //fetch user credentials from localStorage
    if(!credentials){  // Case there's no credential
      console.log('No Credentials!');
      this.router.navigate(['/login']);
      return;
    }
    let newEntry = this.generateReqBody(this.formValues); //generate the body for the request

    if(this.entryTitle){ // if entryTitle is defined then it means that this is an existing entry
      this.editExistingEntry(newEntry, credentials);
    }else{               // otherwise this is a new entry
      this.saveNewEntry(newEntry, credentials);
    }
  }
  // For deleting an entry ==============================================================================>
  async onDelete(){
    const credentials = await this.auth.getCredentials(); //fetch user credentials from localStorage
    const modalData = {                                     // Sets up modal data
      modalTitle: 'Confirm',
      modalMsg: 'Are you sure you want to delete this entry?'
    }
    this.modalService.showConfirmModal(modalData, (result)=>{ // Shows modal prompting the user for cofirmation
      const id = this.stgService.getItem(this.route.snapshot.params['index']).get_id(); // fetch entry id
      const delRoute = `${this.backend.getUrl()}/entries/${id}`;
      const getRoute = `${this.backend.getUrl()}/entries`;
      this.spinnerService.show();                             // show spinner
      
      this.backend.deleteEntry(delRoute, credentials.token, 'application/json').subscribe(()=>{

        this.dataService.downloadEntries(getRoute,credentials.token).then(()=>{
          this.spinnerService.hide();
          this.router.navigate(['dashboard']); 
        }).catch((error)=>{
          this.spinnerService.hide();  // hide spinner
          console.log(error); // log error
          this.router.navigate(['/']); // navigate away
        });

      },(error)=>{
          this.spinnerService.hide();
          let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
          this.modalService.showMsgModal(data,()=>{});
          console.log(error);
      });


    });
  }

  // Navigates to the Dashboard ========================================================================>
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

  editExistingEntry(newEntry, credentials):void{
    let data = this.configureSaveModal('saved', this.entryTitle); // modal configuration
      this.modalService.showPromptModal(data, (response)=>{         // prompt user for a title 
        newEntry.title = response;                                  // set title
        const id = this.stgService.getItem(this.route.snapshot.params['index']).get_id(); // fetch Entry id
        const editRoute = `${this.backend.getUrl()}/entries/${id}`;           // api route for editing an entry
        const getRoute = `${this.backend.getUrl()}/entries`;                  // api route for getting all entries
        this.spinnerService.show();                                 // shows spinner
        this.backend.editEntry(editRoute,newEntry,credentials.token).subscribe(()=>{ //reach api for editing entry
          this.backend.getEntries(getRoute, credentials.token).subscribe((resp)=>{   // reach api for getting all entries
            this.spinnerService.hide();                             // hide spinner
            this.dataService.populateArray(resp.entries);           // populate local array of entries and rendering
            this.router.navigate(['dashboard']);                    // navigate to dashboard page
          },(error)=>{                  //if something goes wrong
            this.spinnerService.hide(); // hide spinner
            console.log('Not Authenticated.', error); // log error
            this.router.navigate(['/']); // navigate away
          });
        },(error)=>{
            this.spinnerService.hide();
            let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
            this.modalService.showMsgModal(data,()=>{});
            console.log(error);
        });
      });
  }

  saveNewEntry(newEntry, credentials):void{
      let data = this.configureSaveModal('new', '');                // modal configuration
      this.modalService.showPromptModal(data, (response)=>{         // prompt user for a title 
        newEntry.title = response;                                  // set title
        const route = `${this.backend.getUrl()}/entries`;                     // api route for saving and fetching entries
        this.spinnerService.show();                                 // show spinner
        this.backend.saveEntry(route,newEntry,credentials.token).subscribe(()=>{ // reach api fro saving new entry
          this.backend.getEntries(route, credentials.token).subscribe((resp)=>{  // reach api for getting all entries
            this.dataService.populateArray(resp.entries);           // populate local array of entries and rendering
            this.router.navigate(['dashboard']);                    // navigate to dashboard page
            this.spinnerService.hide();                             // hide spinner
          },(error)=>{                   //if something goes wrong
            this.spinnerService.hide();  // hide spinner
            console.log('Not Authenticated.', error); // log error
            this.router.navigate(['/']); // navigate away
          });
        },(error)=>{
            this.spinnerService.hide();
            let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
            this.modalService.showMsgModal(data,()=>{});
            console.log(error);
        });
      });
  }


}
