import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ControlService {

  calculate = new Subject<any>();
  clearForm = new Subject<any>();
  save = new Subject<any>();
  delete = new Subject<any>();
  back = new Subject<any>();
  
  constructor() { }

}
