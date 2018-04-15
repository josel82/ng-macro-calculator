import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from '../../services/storage.service';
import { UnitConverterService } from '../../services/unit-converter.service';
import { ControlService } from '../../services/control.service';

import { Entry } from '../../models/entry.model';
import { ListenerService } from '../../services/listener.service';

@Component({
  selector: 'app-entry-input',
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.css']
})
export class EntryInputComponent implements OnInit{

  @Output() entryTitle = new EventEmitter<string>();
  private inputForm: FormGroup;

  constructor(private stgService: StorageService,
              private route: ActivatedRoute,
              private unitConverter: UnitConverterService,
              private controlService: ControlService,
              private listenerService: ListenerService){ }


  ngOnInit() {

    //Subscribe to controls
    this.controlService.calculate.subscribe(() => this.onSubmit());
    this.controlService.clearForm.subscribe(() => this.onClear());

    //gets an specified entry from the Entry array. The entry index is passed in as a parameter in the route
    let entry = this.stgService.getItem(this.route.snapshot.params['index']);
    if(!entry){
      this.inputForm = this.initialiseForm(null);
      this.listenerService.inputFormSubmited.next(this.inputForm);
      this.suscribeToStatusChange(this.inputForm);
      return;
    }
    this.inputForm = this.initialiseForm(this.prepareForImporting(entry));
    this.suscribeToStatusChange(this.inputForm);
    // this.formEmitter.emit(this.prepareForExporting(this.inputForm.value));
    this.listenerService.inputFormSubmited.next(this.inputForm);
    this.entryTitle.emit(entry.getTitle());
  }

  initialiseForm(entry): FormGroup{
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
  suscribeToStatusChange(form:FormGroup){
    form.statusChanges.subscribe((status:any)=>{
      let valid = status === 'VALID'? true : false;
      this.listenerService.isInputformValid.next(valid); 
    });
  }

  onSubmit():void{
    this.listenerService.inputFormSubmited.next(this.inputForm);
  }
  onClear():void{
    this.inputForm.reset();
    //Need to clear the form
  }

  prepareForImporting(values){
    if(values.getIsImperial()){
      values.setWeight(this.unitConverter.kiloToPound(values.getWeight()));
      values.setHeight(this.unitConverter.cmToInch(values.getHeight()));
    }
    return values;
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
