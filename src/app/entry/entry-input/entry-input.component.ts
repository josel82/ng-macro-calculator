import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from '../../services/storage.service';
import { UnitConverterService } from '../../services/unit-converter.service';
import { ControlService } from '../../services/control.service';

import { Entry } from '../../models/entry.model';

@Component({
  selector: 'app-entry-input',
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.css']
})
export class EntryInputComponent implements OnInit {

  @Output() formEmitter = new EventEmitter<any>();
  @Output() entryTitle = new EventEmitter<string>();
  private inputForm: FormGroup;

  constructor(private stgService: StorageService,
              private route: ActivatedRoute,
              private unitConverter: UnitConverterService,
              private controlService: ControlService) { }


  ngOnInit() {

    //Subscribe to controls
    this.controlService.calculate.subscribe(() => this.onSubmit());
    this.controlService.clearForm.subscribe(() => this.onClear());

    //gets an specified entry from the Entry array. The entry index is passed in as a parameter in the route
    let entry = this.stgService.getItem(this.route.snapshot.params['index']);
    if(!entry){
      this.inputForm = this.initialiseForm(null);
      this.formEmitter.emit(null);
      return
    }
    this.inputForm = this.initialiseForm(this.prepareForImporting(entry));
    this.formEmitter.emit(this.prepareForExporting(this.inputForm.value));
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

  onSubmit():void{
    this.formEmitter.emit(this.prepareForExporting(this.inputForm.value));
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
  prepareForExporting(values:{gender:number, age:number, weight:number, height:number, activityMult:number, goalMult:number, isImperial:boolean}){
    if(values.isImperial){
      values.weight = this.unitConverter.poundToKilo(values.weight);
      values.height = this.unitConverter.inchToCm(values.height);
    }
    values.gender = +values.gender; //Casts to number
    return values
  }

}
