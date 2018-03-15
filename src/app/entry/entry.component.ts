import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ModalService } from '../services/modal.service';
import { ControlService } from '../services/control.service';

import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit{

  private formValues;
  private stored: boolean = false;
  private loggedIn:boolean = true;
  private isChanged: boolean = false;



  constructor(private stgService: StorageService,
              private modalService: ModalService,
              private route: ActivatedRoute,
              private router: Router,
              private controlService: ControlService) { }

  ngOnInit(){
  }
  onSubmit(values){
    this.formValues = values;
  }

  onSave(){
    let form = this.formValues;
    let data = {modalTitle: '', modalMsg: '', usrInput: '', successBtn: ''};
    let newEntry = new Entry( null, null,'', form.gender, form.age,
                              form.weight, form.height, form.activityMult,
                              form.goalMult, form.isImperial, null, null);
    if(this.stored){
      data.modalTitle = 'Confirmation';
      data.modalMsg = 'Do you want to override your entry?';
      data.successBtn = 'Ok';
      data.usrInput = "title";
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.setTitle(response);
        this.stgService.edit(this.route.snapshot.params['index'], newEntry);
        this.isChanged = false;
        this.router.navigate(['dashboard']);
      })
    }else{
      data.modalTitle = 'Saving new entry';
      data.modalMsg = 'Insert a title for your new entry';
      data.successBtn = 'Save';
      data.usrInput = "title";
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.setTitle(response);
        this.stgService.push(newEntry);
        this.isChanged = false;
        this.router.navigate(['dashboard']);
      });
    }
  }
  onDelete(){
    let modalData = {
      modalTitle: 'Confirm',
      modalMsg: 'Are you sure you want to delete this entry?'
    }
    this.modalService.showConfirmModal(modalData, (result)=>{
      this.stgService.delete(this.route.snapshot.params['index']);
      this.router.navigate(['dashboard']);
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

}
