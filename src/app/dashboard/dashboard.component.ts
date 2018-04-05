import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { Entry } from '../models/entry.model';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../auth/auth.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataService } from '../services/data.service';

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
              private router: Router) { }

  ngOnInit() {
    this.stgService.entryEvent.subscribe((entries: Entry[])=>{
       this.entryList = entries;
    });
    this.entryList = this.stgService.entries;
  }

  // onDelete(index:number){
  //   this.stgService.delete(index);
  // }
  async onDelete(index:number){
    const credentials = await this.auth.getCredentials();
    let modalData = {
      modalTitle: 'Confirm',
      modalMsg: 'Are you sure you want to delete this entry?'
    }
    this.modalService.showConfirmModal(modalData, (result)=>{
      let id = this.stgService.getItem(index).get_id();
      this.spinnerService.show();
      this.dataService.deleteEntry(id, credentials.token).then(()=>{
        this.dataService.downloadEntries().then((resp)=>{
          this.spinnerService.hide();
          this.dataService.populateArray(resp.entries);
        }).catch((error) => {
          this.spinnerService.hide();
          console.log('Not Authenticated.', error);
          this.router.navigate(['/']);
        });
      }).catch((error) =>{
        this.spinnerService.hide();
        let data = {modalTitle:'Alert', modalMsg:'Unable to connect to the server.'}
        this.modalService.showMsgModal(data,()=>{});
        console.log(error)
      });
    });
  }

}
