import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from '../create-label-form/create-label-form.component';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';
// Victoria Bogachenkova

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss']
})
export class LabelManagementComponent implements OnInit {
  

  constructor(private modalService: NgbModal) {}

  // Open the modal and populate it with users
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent,  { size: 'xl'});
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  // Open the modal and populate it with users
  openCreate() {
    const modalRef = this.modalService.open(CreateLabelFormComponent, { size: 'xl'});
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  ngOnInit(): void {
  }

}
