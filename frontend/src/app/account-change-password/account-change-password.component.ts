import { Component, Input, Output, EventEmitter, } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RequestHandler } from 'app/classes/RequestHandler';
import { User } from 'app/classes/user';
import { InputCheckService } from 'app/input-check.service';

@Component({
  selector: 'app-account-change-password',
  templateUrl: './account-change-password.component.html',
  styleUrls: ['./account-change-password.component.scss']
})
export class AccountChangePasswordComponent {
  /* User object containing account info of the user */
  @Input() userAccount!: User;
  /* Emits an event which will change the page currently being viewed */
  @Output() modeChangeEvent = new EventEmitter<number>();

  /* Error message that displays explanation if the user made a mistake in inputs */
  errorMsg: string = "";

  /* Form storing old password, new password, and repeated new password */
  passwordForm = this.formBuilder.group({
    old_password: "",
    new_password: "",
    new_passwordR: ""
  });

  /**
   * Initializes the formBuilder
   * 
   * @param formBuilder instance of FormBuilder
   */
  constructor(private formBuilder: FormBuilder) {}

  /**
   * Function which will get verify whether the data filled in is valid, encapsulates it in object
   * and sends in to the backend to modify user password.
   * 
   * @modifies errorMsg
   * @trigger user clicks change password button
   */
  editPasswordF() {
    // Object which will be send to the backend
    let passwordInformation: Record<string, any> = {};
    // Puts old password and new password in the object
    passwordInformation = {
      "password" : this.passwordForm.value.old_password,
      "newPassword": this.passwordForm.value.new_password
    };

    // Checks input validity
    let validInput = this.checkInput();

    if (validInput) {
      // Makes change password request to backend
      this.makeRequest(passwordInformation);
    } else {
      // Displays error
      this.errorMsg = "Please fill in all forms correctly";
    }
  }

  /**
   * Checks whether the user input (password) are non empty
   * 
   * @returns whether user input is correct
   * @trigger user clicks change password button
   */
  checkInput() : boolean {
    // Initializes inputCheckService
    let service : InputCheckService = new InputCheckService();

    // Checks input
    return service.checkFilled(this.passwordForm.value.old_password) && 
      service.checkFilled(this.passwordForm.value.new_password) &&
      (this.passwordForm.value.new_password == this.passwordForm.value.new_passwordR);
  }

  /**
   * Function which makes the changepassword request to the backend.
   * Redirects the page upon success or displays an error
   * 
   * @param passwordInformation object holding old and new password
   * @return when change password button is clicked
   */
  async makeRequest(passwordInformation: Record<string, any>) {
    // Get the session token
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Initializes request handler and makes request
    let requestHandler: RequestHandler = new RequestHandler(token);
    let response: any = requestHandler.post("/account/editPassword", passwordInformation, true);

    // Waits on the request
    let result = await response;

    // Displays the response message
    this.errorMsg = result;

    // Executed if password update was successful
    if (result.includes("Updated succesfully")) {
      // Reloads the page, goes back to the info page
      this.modeChangeEvent.emit(0);
    }
  }

}
