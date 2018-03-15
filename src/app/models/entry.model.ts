export class Entry {


  constructor(private _id: string,
              private _userId: string,
              private title: string,
              private gender: number,
              private age: number,
              private weight: number,
              private height: number,
              private activityMult: number,
              private goalMult: number,
              private isImperial: boolean,
              private createdAt:string,
              private updatedAt:string
            ){}

// ================================ SETTERS ===================================
  set_id(id:string){
    this._id = id;
  }
  set_userId(userId:string){
    this._userId = userId;
  }
  setTitle(title: string){
    this.title = title;
  }
  setGender(gender: number){
    this.gender = gender;
  }
  setAge(age: number){
    this.age = age;
  }
  setWeight(weight: number){
    this.weight = weight;
  }
  setHeight(height: number){
    this.height = height;
  }
  setActivityMult(activityMult: number){
    this.activityMult = activityMult;
  }
  setGoalMult(goalMult: number){
    this.goalMult = goalMult;
  }
  setIsImperial(isImperial: boolean){
    this.isImperial = isImperial;
  }
  setCreatedAt(createdAt: string){
    this.createdAt = createdAt;
  }
  setUpdatedAt(updatedAt: string){
    this.updatedAt = updatedAt;
  }
  
// ================================ GETTERS ===================================
  get_id():string{
    return this._id;
  }
  get_userId():string{
    return this._userId;
  }
  getTitle():string{
    return this.title;
  }
  getGender():number{
    return this.gender;
  }
  getAge():number{
    return this.age;
  }
  getWeight():number{
    return this.weight;
  }
  getHeight():number{
    return this.height;
  }
  getActivityMult():number{
    return this.activityMult;
  }
  getGoalMult():number{
    return this.goalMult;
  }
  getIsImperial():boolean{
    return this.isImperial;
  }
  getCreatedAt():string{
    return this.createdAt;
  }
  getUpdatedAt():string{
    return this.updatedAt;
  }
}
