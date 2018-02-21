import { EventEmitter } from '@angular/core';
import { Entry } from '../models/entry.model';

export class StorageService {

  entryEvent = new EventEmitter<Entry[]>();
  entries: Entry[]=[
    new Entry('Low Carb',0, 35, 86, 182, 1.55, 1.15, 3000, 300, 200, 50, 2637, 1200, false),
    new Entry('Bulking',0, 35, 86, 182, 1.375, .85, 1880, 200, 150, 25, 4503, 1200, false)
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
