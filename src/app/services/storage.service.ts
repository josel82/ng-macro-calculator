import { EventEmitter } from '@angular/core';
import { Entry } from '../models/entry.model';

export class StorageService {

  entryEvent = new EventEmitter<Entry[]>();
 
  entries: Entry[]=[];

  push(data:Entry){
    this.entries.push(data);
    this.update();
  }
  edit(index:number, data ):void{
    this.entries[index] = data;
    this.update();
  }
  delete(index:number):void{
    this.entries.splice(index, 1);
    this.update();
  }
  getItems():Entry[]{
    return this.entries;
  }
  getItem(index):Entry{
    return this.entries[index];
  }

  update(){
    this.entryEvent.emit(this.entries);
  }



}
