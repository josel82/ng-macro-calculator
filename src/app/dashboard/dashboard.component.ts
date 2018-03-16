import { Component, OnInit } from '@angular/core';

import { StorageService } from '../services/storage.service';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  entryList: Entry[];

  constructor(private stgService: StorageService) { }

  ngOnInit() {
    this.stgService.entryEvent.subscribe((entries: Entry[])=>{
       this.entryList = entries;
    });
    this.entryList = this.stgService.entries;
  }

  onDelete(index:number){
    this.stgService.delete(index);
  }

}
