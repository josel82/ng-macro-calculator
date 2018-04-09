import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { Entry } from '../models/entry.model';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../auth/auth.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  entryList: Entry[];

  constructor(private stgService: StorageService, 
              private modalService: ModalService,
              private auth: AuthService,
              private spinnerService: Ng4LoadingSpinnerService,
              private dataService: DataService,
              private router: Router, 
              private backend: BackendService) { }

  ngOnInit() {
    this.stgService.entryEvent.subscribe((entries: Entry[])=>{
       this.entryList = entries;
       console.log(this.entryList.length);
       
    });
    this.entryList = this.stgService.entries;
  }


  async onDelete(index:number){
    const credentials = await this.auth.getCredentials();
    let modalData = {
      modalTitle: 'Confirm',
      modalMsg: 'Are you sure you want to delete this entry?'
    }
    this.modalService.showConfirmModal(modalData, (result)=>{ 
      let id = this.stgService.getItem(index).get_id();
      this.spinnerService.show();
      const delRoute = `${this.backend.getUrl()}/entries/${id}`;
      const getRoute = `${this.backend.getUrl()}/entries`;


      this.backend.deleteEntry(delRoute, credentials.token, 'application/json').subscribe(()=>{
        this.backend.getEntries(getRoute, credentials.token).subscribe((resp)=>{  // reach api for getting all entries
          this.spinnerService.hide();                             // hide spinner
          this.dataService.populateArray(resp.entries);           // populate local array of entries and rendering
          this.router.navigate(['dashboard']);                    // navigate to dashboard page
        },(error)=>{                   //if something goes wrong
          this.spinnerService.hide();  // hide spinner
          console.log(error); // log error
          this.router.navigate(['/']); // navigate away
        });
      },(error)=>{
          this.spinnerService.hide();
          let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
          this.modalService.showMsgModal(data,()=>{});
          console.log(error);
      });


    });
  }

}
