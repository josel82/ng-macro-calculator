import { Injectable } from '@angular/core';

import { UnitConverterService } from './unit-converter.service';

@Injectable()
export class CalculatorService {

  constructor(private converter: UnitConverterService) { }

  calcBMR(gender, weight, height, age){

    if(gender === 0){
      return Math.floor((10 * weight) + (6.25 * height) - (5 * age) + 5);
    }else if(gender === 1){
      return Math.floor((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }
  }

  calcTDEE(bmr, act){
    return Math.floor(bmr * act);
  }

  calcTotalCal(tdee, goal){
    return Math.floor(tdee * goal);
  }

  calcProtein(weight, isImperial){
    if(isImperial){
      return Math.floor(weight * .8);
    }else{
      return Math.floor(weight * 1.8);
    }
  }

  calcCarb(totalCal, prot, fat){
    return Math.floor((totalCal - (prot * 4 + fat * 9))/4);
  }

  calcFat(totalCal){
    return Math.floor((totalCal * 0.25)/9);
  }

}
