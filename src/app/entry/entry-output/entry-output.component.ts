import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CalculatorService } from '../../services/calculator.service';
import { ControlService } from '../../services/control.service';

@Component({
  selector: 'app-entry-output',
  templateUrl: './entry-output.component.html',
  styleUrls: ['./entry-output.component.css']
})
export class EntryOutputComponent implements OnInit {

  @Input() set inputFormValues(values){
    if(!values) return;
    let results = this.calculator.calculate(values);
    this.renderResults(results);
  };

  private carbs: number;
  private fat: number;
  private protein: number;
  private dailyCal: number;
  private baseCalcForm: FormGroup = this.initialiseForm();

  constructor(private calculator: CalculatorService,
              private controlService: ControlService) { }

  ngOnInit() {
    this.controlService.clearForm.subscribe(()=>{
      this.clearResults();
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

// Is this actually practical? TDEE and BMR are not saved anyways
  validateTDEE():boolean{
   return this.baseCalcForm.invalid || 
          this.baseCalcForm.get('tdee').value <= this.baseCalcForm.get('bmr').value || 
          this.baseCalcForm.get('tdee').value <= 1000;
  }

 validateBMR():boolean{
    return this.baseCalcForm.invalid || this.baseCalcForm.get('bmr').value < 1000;
  }

}
