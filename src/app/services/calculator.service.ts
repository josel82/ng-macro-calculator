import { Injectable } from '@angular/core';

import { UnitConverterService } from './unit-converter.service';

@Injectable()
export class CalculatorService {

  //Protein/Fat factors Estimation ============================================
  private protMult:number = 1.8; // g of protein per Kg of weight. (Recommended)
  private fatMult:number = .25; // % fat contribuition in the TDEE
  // ==========================================================================

  //Macro to Calorie convertion rates==========================================
  private protToCal:number = 4; // calories per gram of protein
  private carbsToCal:number = 4; // calories per gram of Carbohydrates
  private fatToCal:number = 9; // calories per gram of Fat
  //===========================================================================

  //Mifflin-St Jeor’s Formula coefficients and constants=======================
  private bmrWeightMult:number = 10;
  private bmrHeightMult:number = 6.25;
  private bmrAgeMult:number = 5;
  private bmrMaleConst:number = 5;
  private bmrFemaleConst:number = 161;
  //===========================================================================

  constructor(private converter: UnitConverterService) { }

  calculate(form): { bmr: number,
                     tdee: number,
                     dailyCal: number,
                     macros: { protein:number,
                               fat:number,
                               carbs:number}} {
    let bmr = this.calcBMR(+form.gender, form.weight, form.height, form.age);
    let tdee = this.calcTDEE(bmr, form.activityMult);
    let dailyCal = this.calcTotalCal(tdee, form.goalMult);
    let macros = this.splitMacros(dailyCal, form.weight);
    return { bmr, tdee, dailyCal, macros}
  }

  splitMacros(dailyCal:number, weight:number): {protein:number, fat:number, carbs:number} {
    let protein: number = this.calcProtein(weight);
    let fat: number = this.calcFat(dailyCal);
    let carbs: number = this.calcCarb(dailyCal, protein, fat);
    return {protein, fat , carbs}
  }

  calcBMR(gender, weight, height, age){
    if(gender === 0){
      return Math.floor((this.bmrWeightMult * weight) + (this.bmrHeightMult * height) - (this.bmrAgeMult * age) + this.bmrMaleConst);
    }else if(gender === 1){
      return Math.floor((this.bmrWeightMult * weight) + (this.bmrHeightMult * height) - (this.bmrAgeMult * age) - this.bmrFemaleConst);
    }
  }

  calcTDEE(bmr, act){
    return Math.floor(bmr * act);
  }

  calcTotalCal(tdee, goal){
    return Math.floor(tdee * goal);
  }

  calcProtein(weight){
      return Math.floor(weight * this.protMult);
  }

  calcCarb(totalCal, prot, fat){
    return Math.floor((totalCal - (prot * this.protToCal + fat * this.fatToCal))/this.carbsToCal);
  }

  calcFat(totalCal){
    return Math.floor((totalCal * this.fatMult)/this.fatToCal);
  }

  updateOutputWithDiffBMR(bmr ,form): { tdee:number, 
                                        dailyCal:number, 
                                        macros:{  protein:number,
                                                  fat:number,
                                                  carbs:number}}{
    let tdee = this.calcTDEE(bmr, form.activityMult);
    let dailyCal = this.calcTotalCal(tdee, form.goalMult);
    let macros = this.splitMacros(dailyCal, form.weight);
    return { tdee, dailyCal, macros};
  }
  
  updateOutputWithDiffTDEE(tdee, form): { dailyCal:number, 
                                          macros:{  protein:number,
                                                    fat:number,
                                                    carbs:number}}{
    let dailyCal = this.calcTotalCal(tdee, form.goalMult);
    let macros = this.splitMacros(dailyCal, form.weight);
    return { dailyCal, macros};
  }
  

}
