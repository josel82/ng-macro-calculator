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
              private auth: AuthService,
              private storage: StorageService) { }

  async getEntries():Promise<any>{ //Retrieves Entries from the backend
    const credentials = await this.auth.getCredentials();
    console.log(credentials);
    const header = {key:'x-auth', value: credentials.token};
    return this.backend.getRequest('/entries', header).take(1).toPromise();
  }

  saveEntry(entry, token: string):Promise<any>{
    const header = {key:'x-auth', value: token};
    return new Promise((resolve, reject)=>{
      this.backend.postRequest('/entries', entry, header)
                      .subscribe((resp:HttpResponse<any>)=>{
                          resolve(resp.body);
                      },error => reject(error));
    });
  }

  deleteEntry(id:string, token:string):Promise<any>{
    const header = {key:'x-auth', value: token};
    return this.backend.deleteRequest(`/entries/${id}`, header, 'application/json')
                          .take(1)
                            .toPromise();
  }

  editEntry(id:string, entry, token:string):Promise<any>{
    const header = {key:'x-auth', value: token};
    return this.backend.patchRequest(`/entries/${id}`, entry, header)
                          .take(1)
                            .toPromise();
  }

  populateArray(entries):void{
    this.storage.entries = [];
    for(let entry of entries){
      this.storage.push(this.generateEntry(entry));
    }
  }

  downloadEntries(){
    this.getEntries().then((resp)=>{
      this.populateArray(resp.entries);
    }).catch((error) => {
      console.log('Not Authenticated.',error);
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
