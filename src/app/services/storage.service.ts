import { EventEmitter } from '@angular/core';
import { Entry } from '../models/entry.model';

export class StorageService {

  entryEvent = new EventEmitter<Entry[]>();
  entries: Entry[]=[
    new Entry('1','1','Low Carb',0, 35, 86, 182, 1.55, 1.15, false,'11-03-2018','11-03-2018'),
    new Entry('2','1','Bulking',0, 35, 86, 182, 1.375, .85, false,'11-03-2018','11-03-2018'),
    new Entry('3','1','Bulking 2',0, 35, 86, 182, 1.375, .85, true, '12-03-2018','12-03-2018')
  ];

  push(data: Entry){
    this.entries.push(data);
    this.entryEvent.emit(this.entries);
  }
  edit(index:number, data: Entry){
    this.entries[index] = data;
    this.entryEvent.emit(this.entries);
  }
  delete(index:number){
    this.entries.splice(index, 1);
    this.entryEvent.emit(this.entries);
  }
  getItems(){
    return this.entries;
  }
  getItem(index){
    return this.entries[index];
  }

}
