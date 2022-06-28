//Linh Nguyen
import { Input, Output, EventEmitter, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-add-users-modal',
  templateUrl: './add-users-modal.component.html',
  styleUrls: ['./add-users-modal.component.scss']
})
export class AddUsersModalComponent {

  // The users that should be displayed in the modal
  @Input() users: any;
  // Events emitting what user is added to the project
  @Output() addUserEvent = new EventEmitter<any>();

  /**
   * Initializes the modal
   * 
   * @param activeModal instance of NgbActiveModal
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Function which emits the user clicked on by the user
   * 
   * @param user that has been clicked on
   * @trigger user is clicked on in the modal
   */
  addUser(user: User) : void {
    this.addUserEvent.emit(user);
  }

}
