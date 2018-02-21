import { Kg } from '../enums/mass-units/kg.enum';
import { Lb } from '../enums/mass-units/lb.enum';
import { Cm } from '../enums/length-units/cm.enum';
import { Inch } from '../enums/length-units/inch.enum';

export class UnitConverterService {

  constructor() { }

  poundToKilo(input):number{
    return input * Lb.toKg;
  }

  kiloToPound(input):number{
    return input * Kg.toLb;
  }

  cmToInch(input){
    return input * Cm.toInch;
  }

  inchToCm(input){
    return input * Inch.toCm;
  }
}
