import { Injectable } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Injectable()
export class SpinnerService {
  //Holds a set of spinners. Set ensures we only have one instance of each
  private spinnerCache = new Set<SpinnerComponent>();
  constructor() { }

  _register(spinner: SpinnerComponent):void{
      this.spinnerCache.add(spinner);
  }

  show(spinnerName: string ):void{    
      this.spinnerCache.forEach((spinner) => {
        if(spinner.name === spinnerName){
          spinner.show = true;
        }
      });
  }

  hide(spinnerName: string | null):void{
    this.spinnerCache.forEach((spinner)=>{
      if(spinner.name === spinnerName){
        spinner.show = false;
      }
    });
  }

  showGroup(spinnerGroup: string):void{
    this.spinnerCache.forEach((spinner)=>{
      if(spinner.group === spinnerGroup){
        spinner.show = true;
      }
    });
  }

  hideGroup(spinnerGroup: string):void{
    this.spinnerCache.forEach((spinner)=>{
      if(spinner.group === spinnerGroup){
        spinner.show =false;
      }
    });
  }

  showAll():void{
    this.spinnerCache.forEach(spinner => spinner.show = true);
  }
  hideAll():void{
    this.spinnerCache.forEach(spinner => spinner.show = false);
  }

  isShowing(spinnerName:string):boolean | undefined{
    let showing = undefined;
    this.spinnerCache.forEach((spinner)=>{
      if(spinner.name === spinnerName){
        showing = spinner.show;
      } 
    });
    return showing;
  }
  _unregister(spinnerToRemove: SpinnerComponent):void{
    this.spinnerCache.forEach((spinner)=>{
      if(spinner === spinnerToRemove){
        this.spinnerCache.delete(spinner);
      }
    });
  }

}
