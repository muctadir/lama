//@Author Jarl Jansen

import { Component, Input, Output, EventEmitter, } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { User } from 'app/classes/user';
import { AccountInfoService } from 'app/services/account-info.service';
import { InputCheckService } from 'app/services/input-check.service';
import { ToastCommService } from 'app/services/toast-comm.service';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-account-change-password',
  templateUrl: './account-change-password.component.html',
  styleUrls: ['./account-change-password.component.scss']
})
export class AccountChangePasswordComponent {
  /* User object containing account info of the user */
  @Input() userAccount!: User;
  /* Boolean indicating whether the user is a superadmin */
  @Input() superAdmin!: boolean;
  /* Emits an event which will change the page currently being viewed */
  @Output() modeChangeEvent = new EventEmitter<number>();

  /* Form storing old password, new password, and repeated new password */
  passwordForm = this.formBuilder.group({
    old_password: "",
    new_password: "",
    new_passwordR: ""
  });

  /**
   * Initializes the formBuilder, ToastCommService, accountInfoService
   * 
   * @param formBuilder instance of FormBuilder
   * @param toastCommService instance of ToastCommService
   * @param accountInfoService instance of AccountInfoService
   * @param service instance of the InputCheckService
   */
  constructor(private formBuilder: FormBuilder, 
    private toastCommService: ToastCommService,
    private accountInfoService: AccountInfoService,
    private inputCheckService: InputCheckService) {}

  /**
   * Function which will get verify whether the data filled in is valid, encapsulates it in object
   * and calls function which sends it to the backend to modify user password.
   * 
   * @trigger user clicks change password button
   */
  editPasswordF() : void {
    // Object which will be send to the backend
    let passwordInformation: Record<string, any> = {};
    // Puts old password and new password in the object
    passwordInformation = {
      "id": this.userAccount.getId(),
      "password" : this.passwordForm.value.old_password,
      "newPassword": this.passwordForm.value.new_password
    };

    // Checks input validity
    let validInput = this.checkInput();

    if (validInput) {
      // Makes change password request to backend
      this.makeRequest(passwordInformation);
    } else {
      // Emits an error toast
      this.toastCommService.emitChange([false, "Please fill in all forms correctly!"]);
    }
  }

  /**
   * Checks whether the user input (password) are non empty, new password = old password
   * 
   * @returns whether user input is correct
   * @trigger user clicks change password button
   */
  checkInput() : boolean {
    // Checks input
    return (this.inputCheckService.checkFilled(this.passwordForm.value.old_password) || this.superAdmin) && 
      this.inputCheckService.checkFilled(this.passwordForm.value.new_password) &&
      (this.passwordForm.value.new_password == this.passwordForm.value.new_passwordR);
  }

  /**
   * Function which makes the changepassword request to the backend.
   * Redirects the page upon success or displays an error
   * 
   * @param passwordInformation object holding old and new password
   */
  async makeRequest(passwordInformation: Record<string, any>) : Promise<void> {
    // Tries making the request to the backend to change the password
    try {
      // Makes the request
      await this.accountInfoService.changePassword(passwordInformation);
      // Changes the page to the info page
      this.modeChangeEvent.emit(0);
      // Emits a success toast
      this.toastCommService.emitChange([true, "Password changed"]);
    } catch(e: any) {
      // Check if the error has invalid characters
      if(e.response.status == 511){
        // Displays the error message
        this.toastCommService.emitChange([false, "Input contains a forbidden character: \\ ; , or #"]);
      } else {
        // Sets the error message of the toast
        let message: string = "An unknown error occurred";
        if (e instanceof AxiosError) {
          message = e.response?.data;
        }
        // Emits the error toast
        this.toastCommService.emitChange([false, message]);
      }
    }
  }
}
