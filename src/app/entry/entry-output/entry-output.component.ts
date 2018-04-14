import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CalculatorService } from '../../services/calculator.service';
import { ControlService } from '../../services/control.service';
import { ListenerService } from '../../services/listener.service';

@Component({
  selector: 'app-entry-output',
  templateUrl: './entry-output.component.html',
  styleUrls: ['./entry-output.component.css']
})
export class EntryOutputComponent implements OnInit {

  // @Input() set inputFormValues(values){
  //   if(!values) return;
  //   let results = this.calculator.calculate(values);
  //   this.renderResults(results);
  // };

  private inputFormValues;
  private carbs: number;
  private fat: number;
  private protein: number;
  private dailyCal: number;
  private baseCalcForm: FormGroup = this.initialiseForm();

  constructor(private calculator: CalculatorService,
              private controlService: ControlService,
              private listenerService: ListenerService) { }

  ngOnInit() {
    this.controlService.clearForm.subscribe(()=>{
      this.clearResults();
    });
    this.listenerService.inputFormSubmited.subscribe((formValues)=>{
      if(formValues){
        let results = this.calculator.calculate(formValues);
        this.renderResults(results);
        this.inputFormValues = formValues;
      }
    });
  }

  initialiseForm(): FormGroup{
    return new FormGroup({
      'tdee': new FormControl(null, Validators.required),
      'bmr': new FormControl(null, Validators.required)
    });
  }

  renderResults(results: { bmr: number, tdee: number, dailyCal: number, macros: {protein:number,
                                                                                 fat:number,
                                                                                 carbs:number}}):void{
    this.baseCalcForm.patchValue({
      tdee: results.tdee,
      bmr: results.bmr
    });
    this.dailyCal = results.dailyCal;
    this.protein = results.macros.protein;
    this.fat = results.macros.fat;
    this.carbs = results.macros.carbs;
  }



  clearResults():void{
    this.baseCalcForm.reset();
    this.dailyCal = null;
    this.protein = null;
    this.fat = null;
    this.carbs = null;
  }

// These methods is for making sure only values that would make sence are allowed in the calculator
  validateTDEE():boolean{
   return this.baseCalcForm.invalid || 
          this.baseCalcForm.get('tdee').value <= this.baseCalcForm.get('bmr').value || 
          this.baseCalcForm.get('tdee').value <= 1000;
  }

  validateBMR():boolean{
    return this.baseCalcForm.invalid || this.baseCalcForm.get('bmr').value < 1000;
  }

  onRefreshTDEE():void{
    const bmr = this.baseCalcForm.get('bmr').value;
    const tdee = this.baseCalcForm.get('tdee').value;
    const results = this.calculator
                        .updateOutputWithDiffTDEE(tdee, this.inputFormValues);
    this.renderResults({bmr, tdee, ...results});
  }
  onRefreshBMR():void{
    const bmr = this.baseCalcForm.get('bmr').value;
    const results = this.calculator
                        .updateOutputWithDiffBMR(bmr, this.inputFormValues);
    this.renderResults({bmr, ...results});
  }

}
