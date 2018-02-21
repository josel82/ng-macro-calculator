import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { CalculatorService } from '../services/calculator.service';
import { ModalService } from '../services/modal.service';
import { UnitConverterService } from '../services/unit-converter.service';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit{
  private values = {
    title: '',
    dailyCal: null,
    protein: null,
    fat: null,
    carbs: null,
    tdee: null,
    bmr: null,
    form: {
      gender: null,
      age: null,
      weight: null,
      height: null,
      activity: null,
      goal: null,
      unit: false,
    }
  }
  private stored: boolean = false;
  private isChanged: boolean = false;
  private loggedIn:boolean = false;
  private inputForm: FormGroup;

  constructor(private stgService: StorageService,
              private calculator: CalculatorService,
              private modalService: ModalService,
              private unitConverter: UnitConverterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(){
    let entry = this.stgService.getItem(this.route.snapshot.params['index']);

    if(entry){
      //set values object
      this.values.form.gender = entry.gender;
      this.values.form.age = entry.age;
      this.values.form.weight = entry.isImperial ? Math.round(this.unitConverter.kiloToPound(entry.weight)) : entry.weight;
      this.values.form.height = entry.isImperial ? Math.round(this.unitConverter.cmToInch(entry.height)) : entry.height;
      this.values.form.activity = entry.activityMult;
      this.values.form.goal = entry.goalMult;
      this.values.form.unit = entry.isImperial;
      this.values.tdee = entry.tdee;
      this.values.bmr = entry.bmr;
      this.values.title = entry.title;
      this.values.dailyCal = entry.dailyCal;
      this.values.protein = entry.protein;
      this.values.carbs = entry.carbs;
      this.values.fat = entry.fat;
      this.stored = true;
      //Fake login
      this.loggedIn = true;
    }
    //set the form
    this.inputForm = this.onFormInit(this.values);

  }

  onFormInit(input): FormGroup{
    return new FormGroup({
      'gender': new FormControl(input.form.gender, Validators.required),
      'age': new FormControl(input.form.age, Validators.required),
      'weight': new FormControl(input.form.weight, Validators.required),
      'height': new FormControl(input.form.height, Validators.required),
      'activity': new FormControl(input.form.activity, Validators.required),
      'goal': new FormControl(input.form.goal, Validators.required),
      'unit': new FormControl(input.form.unit, Validators.required),
      'tdee': new FormControl(input.tdee),
      'bmr': new FormControl(input.bmr)
    });
  }

  onCalculate(){
    let form = this.inputForm.value;
    if(form.unit === 'true'){// Checks if the unit system is imperial
      this.values.form.weight = Math.floor(this.unitConverter.poundToKilo(form.weight));
      this.values.form.height = Math.floor(this.unitConverter.inchToCm(form.height));
    }else{
      this.values.form.weight = form.weight;
      this.values.form.height = form.height;
    }
    this.values.bmr = this.calculator.calcBMR(+form.gender, this.values.form.weight, this.values.form.height, form.age);
    this.values.tdee = this.calculator.calcTDEE(this.values.bmr, form.activity);
    this.values.dailyCal = this.calculator.calcTotalCal(this.values.tdee, +form.goal);
    this.values.protein = this.calculator.calcProtein(this.values.form.weight, this.values.form.unit);
    this.values.fat = this.calculator.calcFat(this.values.dailyCal);
    this.values.carbs = this.calculator.calcCarb(this.values.dailyCal, this.values.protein, this.values.fat);
    this.inputForm.patchValue({
      tdee: this.values.tdee,
      bmr: this.values.bmr
    });
    this.isChanged = true;
  }

  onRefreshTDEE(){
    let form = this.inputForm.value;
    this.values.tdee = form.tdee;
    this.values.dailyCal = this.calculator.calcTotalCal(this.values.tdee, form.goal);
    this.values.protein = this.calculator.calcProtein(this.values.form.weight, this.values.form.unit);
    this.values.fat = this.calculator.calcFat(this.values.dailyCal);
    this.values.carbs = this.calculator.calcCarb(this.values.dailyCal, this.values.protein, this.values.fat);
    this.isChanged = true;
  }

  onRefreshBMR(){
    let form = this.inputForm.value;
    this.values.tdee = this.calculator.calcTDEE(form.bmr, form.activity);
    this.values.dailyCal = this.calculator.calcTotalCal(this.values.tdee, form.goal);
    this.inputForm.patchValue({tdee: this.values.tdee})
    this.onRefreshTDEE();
    this.isChanged = true;
    console.log(this.inputForm.get('bmr').value);
  }

  onClear(){
    this.inputForm.reset();
  }

  onSave(){
    let form = this.inputForm.value;
    let data = {modalTitle: '', modalMsg: '', usrInput: '', successBtn: ''};
    let newEntry = new Entry( '', form.gender, form.age,
                              this.values.form.weight, this.values.form.height, form.activity,
                              form.goal, this.values.dailyCal, this.values.carbs,
                              this.values.protein, this.values.fat, this.values.tdee,
                              this.values.bmr, form.unit);
    if(this.stored){
      data.modalTitle = 'Confirmation';
      data.modalMsg = 'Do you want to override your entry?';
      data.successBtn = 'Ok';
      data.usrInput = this.values.title;
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
      data.usrInput = this.values.title;
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
