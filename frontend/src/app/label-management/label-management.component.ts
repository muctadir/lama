import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Victoria Bogachenkova

// Template for the modal
@Component({
  selector: 'app-label-management',
  styleUrls: ['./label-management.component.scss'],
  template: `
  <div class="modal-header">
  <h4 class="modal-title">Create Label</h4>
  <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
</div>
<div class="modal-body row" style="padding:2px 16px;">
  <form action="/action_page.php">
    <div class="row">
      <div class="col">
        <p>Label </p>
        <hr>
        <select id="label-type" name="label-type">
          <option value="volvo">Emotion</option>
          <option value="saab">Good</option>
          <option value="fiat">Bad</option>
        </select>
        <br><br>
        <p>Label Name</p>
        <hr>
        <textarea class="form-control" rows="2" placeholder="Label Name" maxlength="140"></textarea> 
      </div>
      <div class="col">
        <p>Merge Name</p>
        <hr>
        <textarea class="form-control" rows="1" placeholder="Label Name" maxlength="140"></textarea> 
        <br><br>
        <p>Description</p>
        <textarea class="form-control" rows="6" placeholder="Description" maxlength="140"></textarea>
      </div>
    </div>
  </form>
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
    <div class="modal-body row" style="padding:2px 16px;">
      <form action="/action_page.php">
        <div class="row">
          <div class="col">
            <p>Label Type</p>
            <hr>
            <select id="label-type" name="label-type">
              <option value="volvo">Emotion</option>
              <option value="saab">Good</option>
              <option value="fiat">Bad</option>
            </select>
            <br><br>
            <p>Label Name</p>
            <hr>
            <textarea class="form-control" rows="2" placeholder="Label Name" maxlength="140"></textarea> 
          </div>
          <div class="col">
            <p>Description</p>
            <textarea class="form-control" rows="6" placeholder="Description" maxlength="140"></textarea>
          </div>
        </div>
      </form>
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
    const modalRef = this.modalService.open(MergeLabelsModalContent,  { size: 'xl'});
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  // Open the modal and populate it with users
  openCreate() {
    const modalRef = this.modalService.open(CreateLabelsModalContent, { size: 'xl'});
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
