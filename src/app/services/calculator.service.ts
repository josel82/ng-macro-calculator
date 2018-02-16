export class CalculatorService {

  constructor() { }

  calcBMR(gender, weight, height, age, unit){
    if(gender === 0 && unit === 'imperial'){
      return  Math.floor((10 * weight * .4536) + (6.25 * height * 2.54) - (5 * age) + 5);
    }else if(gender === 0 && unit === 'metric'){
      return Math.floor((10 * weight) + (6.25 * height) - (5 * age) + 5);
    }else if(gender === 0 && unit === 'imperial'){
      return Math.floor((10 * weight * .4536) + (6.25 * height * 2.54) - (5 * age) - 161);
    }else if(gender === 0 && unit === 'metric'){
      return Math.floor((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }
  }

  calcTDEE(bmr, act){
    return Math.floor(bmr * act);
  }

  calcTotalCal(tdee, goal){
    return Math.floor(tdee * goal);
  }

  calcProtein(weight, unit){
    if(unit === 'imperial'){
      return Math.floor(weight * .8);
    }else if(unit === 'metric'){
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
