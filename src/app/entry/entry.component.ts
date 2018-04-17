import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ModalService } from '../services/modal.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../auth/auth.service';
import { default as config} from './save-modal.config';

import { Entry } from '../models/entry.model';
import { FormInput } from '../shared/form-input.interface';
import { BackendService } from '../services/backend.service';
import { SpinnerService } from '../services/spinner.service';
import { ListenerService } from '../services/listener.service';
import { UnitConverterService } from '../services/unit-converter.service';
import { CalculatorService } from '../services/calculator.service';


@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit{

  
  private inputForm: FormGroup;
  private baseCalcForm: FormGroup;
  private inputFormValid:boolean = false;

  private carbs: number;
  private fat: number;
  private protein: number;
  private dailyCal: number;
  
  private formValues;
  private entryTitle;
  private stored:boolean;
  private loggedIn:boolean;
  
  private isNewEntry:boolean = true;



  constructor(private stgService: StorageService,
              private modalService: ModalService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService,
              private spinnerService: SpinnerService,
              private backend: BackendService,
              private listenerService: ListenerService,
              private unitConverter: UnitConverterService,
              private calculator: CalculatorService) { }


  // ====================================================================================================
  // ====================================== Component Initialisation ====================================
  // ====================================================================================================
   ngOnInit(){

    //Checks if it is a validated user
    this.auth.getCredentials().then((credentials)=>{
      //Sets loggedIn property which is used as a condition for 
      //the ngIf directive placed in the save/delete/back button group
      this.loggedIn = credentials ? true : false;
    }).catch(err => this.loggedIn = false);

    //gets an specified entry from the Entry array. 
    //The entry index is passed in as a parameter in the route
    let entry = this.stgService.getItem(this.route.snapshot.params['index']);
    if(!entry){ // no entry. Initialise forms with null values and returns
      this.inputForm = this.initialiseInputForm(null);
      this.baseCalcForm = this.initialiseBaseCalcForm(null);
      return; 
    } 

    const preparedValues = this.prepareForImporting(entry); //Casts some of the values to the correct type
    this.inputForm = this.initialiseInputForm(preparedValues); // Initialises InputForm
    this.baseCalcForm = this.initialiseBaseCalcForm(preparedValues); //Initialises BaseCalcForm
    this.renderResults(this.calculator.calculate(this.inputForm.value)); //Calculate values and render to the view
    this.entryTitle = preparedValues.getTitle(); //Grabs the title of the entry. Since it is used in other operations
    this.isNewEntry = false; //Sets condition to false. Since this is an existing entry
  }


  // ====================================================================================================
  // ======================================== Form Initialisation =======================================
  // ====================================================================================================
  initialiseInputForm(entry): FormGroup{
    return new FormGroup({
      'gender': new FormControl(entry ? entry.gender.toString() : null, Validators.required),
      'age': new FormControl(entry ? entry.age : null, Validators.required),
      'weight': new FormControl(entry ? entry.weight : null, Validators.required),
      'height': new FormControl(entry ? entry.height : null, Validators.required),
      'activityMult': new FormControl(entry ? entry.activityMult : null, Validators.required),
      'goalMult': new FormControl(entry ? entry.goalMult : null, Validators.required),
      'isImperial': new FormControl(entry ? entry.isImperial : false)
    });
  }

  initialiseBaseCalcForm(entry): FormGroup{
    return new FormGroup({
      'tdee': new FormControl(entry? entry.tdee: null, Validators.required),
      'bmr': new FormControl(entry? entry.bmr: null, Validators.required)
    });
  }

  // ====================================================================================================
  // ======================================= Save/Delete operations =====================================
  // ====================================================================================================
  async onSave(){ 
    
    const credentials = await this.auth.getCredentials(); //fetch user credentials from localStorage
    if(!credentials){  // Case there's no credential
      console.log('No Credentials!');
      this.router.navigate(['/login']);
      return;
    }
    let newEntry = this.generateReqBody(this.inputForm.value); //generate the body for the request

    if(this.entryTitle){ // if entryTitle is defined then it means that this is an existing entry 
      this.editExistingEntry(newEntry, credentials);
    }else{               // otherwise this is a new entry
      this.saveNewEntry(newEntry, credentials);
    }
  }

  async onDelete(){
    const credentials = await this.auth.getCredentials(); //fetch user credentials from localStorage
    const modalData = {                                     // Sets up modal data
      modalTitle: 'Confirm',
      modalMsg: 'Are you sure you want to delete this entry?'
    }
    this.modalService.showConfirmModal(modalData, (result)=>{ // Shows modal prompting the user for cofirmation
      const id = this.stgService.getItem(this.route.snapshot.params['index']).get_id(); // fetch entry id
      const delRoute = `${this.backend.getUrl()}/entries/${id}`;
      const getRoute = `${this.backend.getUrl()}/entries`;
      this.spinnerService.show("mySpinner");                             // show spinner
      
      this.backend.deleteEntry(delRoute, credentials.token, 'application/json').subscribe(()=>{

        this.dataService.downloadEntries(getRoute,credentials.token).then(()=>{
          this.spinnerService.hide("mySpinner");
          this.router.navigate(['dashboard']); 
        }).catch((error)=>{
          this.spinnerService.hide("mySpinner");  // hide spinner
          console.log(error); // log error
          this.router.navigate(['/']); // navigate away
        });

      },(error)=>{
          this.spinnerService.hide("mySpinner");
          let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
          this.modalService.showMsgModal(data,()=>{});
          console.log(error);
      });
    });
  }


  // ====================================================================================================
  // ============================================ Navigation ============================================
  // ====================================================================================================
  onBack(){ 
    
    if(!this.inputForm.touched && !this.baseCalcForm.touched) return this.router.navigate(['dashboard']);
    let modalData = {
      modalTitle: 'Confirm',
      modalMsg: 'Do you want to leave without saving your changes?'
    }
    this.modalService.showConfirmModal(modalData, (response)=>{
      this.router.navigate(['dashboard']);
    });
  }

  // ====================================================================================================
  // ============================================ Calculations ==========================================
  // ====================================================================================================

  onCalculate():void{
    this.renderResults(this.calculator.calculate(this.inputForm.value));
  }

  onRefreshTDEE():void{

    const bmr = this.baseCalcForm.get('bmr').value;
    const tdee = this.baseCalcForm.get('tdee').value;
    const results = this.calculator
    .updateOutputWithDiffTDEE(tdee, this.inputForm.value);
    this.renderResults({bmr, tdee, ...results});
  }
  onRefreshBMR():void{
    const bmr = this.baseCalcForm.get('bmr').value;
    const results = this.calculator
    .updateOutputWithDiffBMR(bmr, this.inputForm.value);
    this.renderResults({bmr, ...results});
  }



  // ====================================================================================================
  // ============================================= Modals ===============================================
  // ====================================================================================================

  configureSaveModal(key:string, input){
    let data = {modalTitle: '', modalMsg: '', usrInput: '', successBtn: ''};
    data.modalTitle = config[key].modalTitle;
    data.modalMsg = config[key].modalMsg;
    data.successBtn = config[key].successBtn;
    data.usrInput = input;
    return data;
  }

  // ====================================================================================================
  // ======================================== Data Formatting ===========================================
  // ====================================================================================================

  generateReqBody(form):FormInput{
    return {
            title: "",
            gender: +form.gender,
            age: form.age,
            weight:form.weight,
            height: form.height,
            activityMult: +form.activityMult,
            goalMult:+form.goalMult,
            isImperial: form.isImperial
          }
  }

  prepareForImporting(values){
    if(values.getIsImperial()){
      values.setWeight(this.unitConverter.kiloToPound(values.getWeight()));
      values.setHeight(this.unitConverter.cmToInch(values.getHeight()));
    }
    return values;
  }

  // ====================================================================================================
  // ======================================== Save/Edit Methods =========================================
  // ====================================================================================================

  saveNewEntry(newEntry, credentials):void{
      let data = this.configureSaveModal('new', '');                // modal configuration
      this.modalService.showPromptModal(data, (response)=>{         // prompt user for a title 
        newEntry.title = response;                                  // set title
        const route = `${this.backend.getUrl()}/entries`;                     // api route for saving and fetching entries
        this.spinnerService.show("mySpinner");                                 // show spinner
        this.backend.saveEntry(route,newEntry,credentials.token).subscribe(()=>{ // reach api fro saving new entry
          this.backend.getEntries(route, credentials.token).subscribe((resp)=>{  // reach api for getting all entries
            this.dataService.populateArray(resp.entries);           // populate local array of entries and rendering
            this.router.navigate(['dashboard']);                    // navigate to dashboard page
            this.spinnerService.hide("mySpinner");                             // hide spinner
          },(error)=>{                   //if something goes wrong
            this.spinnerService.hide("mySpinner");  // hide spinner
            console.log('Not Authenticated.', error); // log error
            this.router.navigate(['/']); // navigate away
          });
        },(error)=>{
            this.spinnerService.hide("mySpinner");
            let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
            this.modalService.showMsgModal(data,()=>{});
            console.log(error);
        });
      });
  }

  editExistingEntry(newEntry, credentials):void{
    let data = this.configureSaveModal('saved', this.entryTitle); // modal configuration
      this.modalService.showPromptModal(data, (response)=>{         // prompt user for a title 
        newEntry.title = response;                                  // set title
        const id = this.stgService.getItem(this.route.snapshot.params['index']).get_id(); // fetch Entry id
        const editRoute = `${this.backend.getUrl()}/entries/${id}`;           // api route for editing an entry
        const getRoute = `${this.backend.getUrl()}/entries`;                  // api route for getting all entries
        this.spinnerService.show("mySpinner");                                 // shows spinner
        this.backend.editEntry(editRoute,newEntry,credentials.token).subscribe(()=>{ //reach api for editing entry
          this.backend.getEntries(getRoute, credentials.token).subscribe((resp)=>{   // reach api for getting all entries
            this.spinnerService.hide("mySpinner");                             // hide spinner
            this.dataService.populateArray(resp.entries);           // populate local array of entries and rendering
            this.router.navigate(['dashboard']);                    // navigate to dashboard page
          },(error)=>{                  //if something goes wrong
            this.spinnerService.hide("mySpinner"); // hide spinner
            console.log('Not Authenticated.', error); // log error
            this.router.navigate(['/']); // navigate away
          });
        },(error)=>{
            this.spinnerService.hide("mySpinner");
            let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
            this.modalService.showMsgModal(data,()=>{});
            console.log(error);
        });
      });
  }

// ====================================================================================================
// ============================================ Rendering =============================================
// ====================================================================================================

  renderResults(results: {  bmr: number, 
                            tdee: number, 
                            dailyCal: number, 
                            macros: {protein:number,
                                    fat:number,
                                    carbs:number}}):void{

    this.baseCalcForm.patchValue({  tdee: results.tdee, bmr: results.bmr });

    this.dailyCal = results.dailyCal;
    this.protein = results.macros.protein;
    this.fat = results.macros.fat;
    this.carbs = results.macros.carbs;
  }

  onClear():void{
    this.inputForm.reset();
    this.baseCalcForm.reset();
    this.dailyCal = null;
    this.protein = null;
    this.fat = null;
    this.carbs = null;
  }

  // ====================================================================================================
  // ============================================= Validation ===========================================
  // ====================================================================================================

  // These methods is for making sure only values that would make sence are allowed in the calculator
  validateTDEE():boolean{
    return this.baseCalcForm.invalid || 
    this.baseCalcForm.get('tdee').value <= this.baseCalcForm.get('bmr').value || 
    this.baseCalcForm.get('tdee').value <= 1000;
  }

  validateBMR():boolean{
    return this.baseCalcForm.invalid || this.baseCalcForm.get('bmr').value < 1000;
  }

  validateWeightControl(form:FormControl):string{

    if(!form.get('weight').valid && form.get('weight').touched){
      return 'INVALID'
    }else if(form.get('weight').valid && form.get('weight').touched && form.get('isImperial').value === false){
      return 'METRIC'
    }else if(form.get('weight').valid && form.get('weight').touched && form.get('isImperial').value === true){
      return 'IMPERIAL'
    }else{
      return null;
    }
  }

  validateHeightControl(form:FormControl):string{
    if(!form.get('height').valid && form.get('height').touched){
      return 'INVALID'
    }else if(form.get('height').valid && form.get('height').touched && form.get('isImperial').value === false){
      return 'METRIC'
    }else if(form.get('height').valid && form.get('height').touched && form.get('isImperial').value === true){
      return 'IMPERIAL'
    }else{
      return null;
    }
  }
}
