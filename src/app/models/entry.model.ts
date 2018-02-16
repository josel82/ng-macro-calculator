export class Entry {

  createdAt: string;

  constructor(public title: string, public gender: number, public age: number, public weight: number,
               public height: number, public activityMult: number, public goalMult: number,
               public dailyCal: number, public carbs: number, public protein: number, public fat: number,
               public tdee: number, public bmr: number){

  this.createdAt = new Date().toString();
  }


}
