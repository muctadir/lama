import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-edit-account-settings',
  templateUrl: './edit-account-settings.component.html',
  styleUrls: ['./edit-account-settings.component.scss']
})
export class EditAccountSettingsComponent {
  @Input() user!: any;
  @Output() editEvent = new EventEmitter<boolean>();

  edit: boolean = false;
  editPassword: boolean = false;

  /* Error message displayed when user modifies settings incorrectly */
  errorMsg: string = ""; 

  changeInformation() {
    console.log("changeinfo");
  }

  cancelEditButton() {
    console.log("cancelbuttonpressed");
    console.log(this.user);
    this.editEvent.emit(false);
  }


}
