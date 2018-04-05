import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router, private modalService: ModalService) { }

  ngOnInit() {
  }

  onSignUp(){
    let modalData = {
      modalTitle: 'Alert!',
      modalMsg: 'Sorry. Sign up feature is currently in development. Please go to the calculator.'
    }
    this.modalService.showConfirmModal(modalData, (response)=>{
      this.router.navigate(['/calculator']);
    });
  }



}
