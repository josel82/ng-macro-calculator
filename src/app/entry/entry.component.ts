import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { CalculatorService } from '../services/calculator.service';
import { ModalService } from '../services/modal.service';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit{
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
      'gender': new FormControl(entry ? entry.gender : null, Validators.required),
      'age': new FormControl(entry ? entry.age : null, Validators.required),
      'weight': new FormControl(entry ? entry.weight : null, Validators.required),
      'height': new FormControl(entry ? entry.height : null, Validators.required),
      'activity': new FormControl(entry ? entry.activityMult : null, Validators.required),
      'goal': new FormControl(entry ? entry.goalMult : null, Validators.required),
      'unit': new FormControl(entry ? 'metric' : 'metric', Validators.required),
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
    if(this.inputForm.invalid){
      return;
    }
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
    console.log(this.inputForm.get('bmr').value);
  }

  onSave(){
    let form = this.inputForm.value;
    let data = {modalTitle: '', modalMsg: '', usrInput: '', successBtn: ''};
    let newEntry = new Entry( '', form.gender, form.age,
                              form.weight, form.height, form.activity,
                              form.goal, this.dailyCal, this.carbs,
                              this.protein, this.fat, this.tdee,
                              this.bmr);

    if(this.stored){
      data.modalTitle = 'Confirmation';
      data.modalMsg = 'Do you want to override your entry?';
      data.successBtn = 'Ok';
      data.usrInput = this.title;
      this.modalService.showPromptModal(data, (response)=>{
        newEntry.title = response;
        this.stgService.edit(this.route.snapshot.params['index'], newEntry);
        this.isChanged = false;
        this.router.navigate(['dashboard']);
      })
    }else{
      data.modalTitle = 'Saving new entry';
      data.modalMsg = 'Insert a title for your new entry';
      data.successBtn = 'Save';
      data.usrInput = this.title;
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
  onEnable(control:FormControl){
    control.enable();
  }
}
