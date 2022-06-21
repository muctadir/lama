import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Output() confirmEvent = new EventEmitter<boolean>();

  /**
   * Initializes the NgbActiveModal and the router
   * 
   * @param activeModal instance of NgbActiveModal
   * @param route instance of Router
   */
   constructor(public activeModal: NgbActiveModal, private route: Router) { }

  confirm() : void {
    this.confirmEvent.emit(true);
    this.activeModal.close();
  }

}
