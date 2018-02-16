import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { CalculatorService } from '../services/calculator.service';
import { PromptModalComponent } from '../modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ModalService } from '../services/modal.service';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent{
  private title: string = '';
  private dailyCal: number;
  private bmr:number;
  private tdee:number;
  private protein: number;
  private fat:number;
  private carbs:number;
  private stored: boolean = false;
  private isChanged: boolean = false;
  private inputForm: FormGroup;

  constructor(private stgService: StorageService,
              private calculator: CalculatorService,
              private modalService: ModalService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(){
    let entry = this.stgService.getItem(this.route.snapshot.params['index']);
    this.inputForm = new FormGroup({
      'gender': new FormControl(entry ? entry.gender : null),
      'age': new FormControl(entry ? entry.age : null),
      'weight': new FormControl(entry ? entry.weight : null),
      'height': new FormControl(entry ? entry.height : null),
      'activity': new FormControl(entry ? entry.activityMult : null),
      'goal': new FormControl(entry ? entry.goalMult : null),
      'unit': new FormControl(entry ? 'metric' : 'metric'),
      'tdee': new FormControl(entry ? entry.tdee : null),
      'bmr': new FormControl(entry ? entry.bmr : null)
    });
    if(entry){
      this.stored = true;
      this.title = entry.title;
      this.dailyCal = entry.dailyCal;
      this.protein = entry.protein;
      this.carbs = entry.carbs;
      this.fat = entry.fat;
      this.tdee = entry.tdee;
      this.bmr = entry.bmr;
    }
  }

  onCalculate(){
    let form = this.inputForm.value;
    this.bmr = this.calculator.calcBMR(+form.gender, form.weight, form.height, form.age, form.unit);
    this.tdee = this.calculator.calcTDEE(this.bmr, form.activity);
    this.dailyCal = this.calculator.calcTotalCal(this.tdee, +form.goal);
    this.protein = this.calculator.calcProtein(form.weight, form.unit);
    this.fat = this.calculator.calcFat(this.dailyCal);
    this.carbs = this.calculator.calcCarb(this.dailyCal, this.protein, this.fat);
    this.inputForm.patchValue({
      tdee: this.tdee,
      bmr: this.bmr
    });
    this.isChanged = true;
  }

  onRefreshTDEE(){
    let form = this.inputForm.value;
    this.tdee = form.tdee;
    this.dailyCal = this.calculator.calcTotalCal(this.tdee, form.goal);
    this.protein = this.calculator.calcProtein(form.weight, form.unit);
    this.fat = this.calculator.calcFat(this.dailyCal);
    this.carbs = this.calculator.calcCarb(this.dailyCal, this.protein, this.fat);
    this.isChanged = true;
  }

  onRefreshBMR(){
    let form = this.inputForm.value;
    this.tdee = this.calculator.calcTDEE(form.bmr, form.activity);
    this.dailyCal = this.calculator.calcTotalCal(this.tdee, form.goal);
    this.inputForm.patchValue({tdee: this.tdee})
    this.onRefreshTDEE();
    this.isChanged = true;
  }

  onSave(){
    let form = this.inputForm.value;
    let data = {modalTitle: '', modalMsg: '', entryTitle: '', successBtn: ''};
    let newEntry = new Entry( '', form.gender, form.age,
                              form.weight, form.height, form.activity,
                              form.goal, this.dailyCal, this.carbs,
                              this.protein, this.fat, this.tdee,
                              this.bmr);

    if(this.stored){
      data.modalTitle = 'Confirmation';
      data.modalMsg = 'Do you want to override your entry?';
      data.successBtn = 'Ok';
      data.entryTitle = this.title;
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.title = response;
        this.stgService.edit(this.route.snapshot.params['index'], newEntry);
        this.isChanged = false;
        this.onBack();
      })
    }else{
      data.modalTitle = 'Saving new entry';
      data.modalMsg = 'Insert a title for your new entry';
      data.successBtn = 'Save';
      data.entryTitle = this.title;
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.title = response;
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
}
