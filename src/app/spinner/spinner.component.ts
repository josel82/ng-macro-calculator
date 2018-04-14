import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

//credits: http://codetunnel.io/how-to-do-loading-spinners-the-angular-2/

@Component({
  selector: 'spinner',
  template: `
    <div *ngIf="show">
      <img [src]="loadingImage" *ngIf="loadingImage"/>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private isShowing = false;
  @Input() name: string;
  @Input() group:string;
  @Input() loadingImage: string;
  @Input() get show():boolean{
    return this.isShowing;
  }
  @Output() showChange = new EventEmitter();
  set show(val:boolean){
    this.isShowing = val;
    this.showChange.emit(this.isShowing);
  }

  constructor(private spinnerService: SpinnerService) { }
  

  ngOnInit() {
    if(!this.name) throw new Error("Spinner requires a name.");
    this.spinnerService._register(this);
  }
  
  ngOnDestroy(){
    this.spinnerService._unregister(this);
  }
}
