import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/take';

import { BackendService } from './backend.service';
import { UserCredentials } from '../auth/user-credentials.interface';
import { AuthService } from '../auth/auth.service';
import { StorageService } from './storage.service';
import { ResponseBody } from '../shared/response-body.interface';
import { Entry } from '../models/entry.model';

@Injectable()
export class DataService {

  constructor(private backend: BackendService,
              private storage: StorageService) { }

  populateArray(entries:Array<any>):void{
    this.storage.entries = [];
    if(entries.length<=0){
      this.storage.update();
      return;  
    }
    for(let entry of entries){
      this.storage.push(this.generateEntry(entry));
    }
  }

  downloadEntries(route, token): Promise<any>{
    return new Promise((resolve, reject)=>{
      this.backend.getEntries(route, token)
                    .subscribe((resp)=>{
                       this.populateArray(resp.entries);
                       resolve();
                    },error => reject(error));
    });
    
  }

  generateEntry(body: ResponseBody):Entry{
    return new Entry(
            body._id,
            body._userId,
            body.title,
            body.gender,
            body.age,
            body.weight,
            body.height,
            body.activityMult,
            body.goalMult,
            body.isImperial,
            body.createdAt,
            body.updatedAt,
            body.__v);
  }
}
