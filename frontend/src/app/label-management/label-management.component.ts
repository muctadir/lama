import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Victoria Bogachenkova

// Template for the modal
@Component({
  selector: 'app-label-management',
  styleUrls: ['./label-management.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Merge Labels</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body row" *ngFor="let user of users" style="padding:2px 16px; max-height: 25px;">
        
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      </div>
  `
})

// Content of the modal
export class MergeLabelsModalContent {

  constructor(public activeModal: NgbActiveModal) {}

}

// Template for the modal
@Component({
  selector: 'app-label-management',
  styleUrls: ['./label-management.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Create Label</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body row" *ngFor="let user of users" style="padding:2px 16px; max-height: 25px;">
        
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      </div>
  `
})

// Content of the modal
export class CreateLabelsModalContent {

  constructor(public activeModal: NgbActiveModal) {}

}

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss']
})
export class LabelManagementComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  // Open the modal and populate it with users
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelsModalContent);
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  // Open the modal and populate it with users
  openCreate() {
    const modalRef = this.modalService.open(CreateLabelsModalContent);
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
