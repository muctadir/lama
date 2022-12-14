//@Author Jarl Jansen

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { User } from 'app/classes/user';
import { AccountInfoService } from 'app/services/account-info.service';
import { InputCheckService } from 'app/services/input-check.service';
import { ToastCommService } from 'app/services/toast-comm.service';

@Component({
  selector: 'app-edit-account-settings',
  templateUrl: './edit-account-settings.component.html',
  styleUrls: ['./edit-account-settings.component.scss']
})

export class EditAccountSettingsComponent {
  /* User details that get passed from the parent component */
  @Input() userAccount!: User;
  /* Sends an event with the next page account settings page to display */
  @Output() modeChangeEvent = new EventEmitter<number>();

  /* Form displayed on the page containing username, email and description */
  accountForm = this.formBuilder.group({
    username: "",
    email: "",
    description: ""
  });

  /**
   * Initializes the form builder
   * 
   * @param formBuilder instance of FormBuilder
   * @param toastCommService instance of ToastCommService
   * @param accountInfoService instance of AccountInfoService
   * @param service instance of the InputCheckService
   */
  constructor(private formBuilder: FormBuilder,
    private toastCommService: ToastCommService,
    private accountInfoService: AccountInfoService,
    private service: InputCheckService) { }

  /**
   * When the userAccount gets modified it ensures that this change is communicated 
   * to the local variables of this component.
   * 
   * @trigger change occurs in the component
   * @modifies accountForm
   */
  ngOnChanges(): void {
    this.accountForm.setValue({
      username: this.userAccount.getUsername(),
      email: this.userAccount.getEmail(),
      description: this.userAccount.getDesc()
    });
  }

  /**
   * Updates the account information of the user when they have finished modifying their account info
   * 
   * @trigger Change button is clicked
   * @modifies errorMsg
   */
  changeInformation(): void {
    // Creates object which will be send to the backend
    let accountInformation: Record<string, any> = {};

    // Enters the data into the object
    accountInformation = {
      "id": this.userAccount.getId(),
      "username": this.accountForm.value.username,
      "description": this.accountForm.value.description,
      "email": this.accountForm.value.email
    };

    // Sends request to backend if input is valid, otherwise displays error message
    if (this.checkInput()) {
      // Calls function responsible for making the request to the backend
      this.makeRequest(accountInformation)
    } else {
      // Displays an error message to the user
      this.toastCommService.emitChange([false, "Please fill in all forms correctly!"]);
    }
  }

  /**
   * Checks the input of the accountForm about whether its content is correct.
   * 
   * @returns whether input is valid
   * @trigger on click of change button
   */
  checkInput(): boolean {
    // Checks input
    return this.service.checkFilled(this.accountForm.value.username) &&
      this.service.checkFilled(this.accountForm.value.email) &&
      this.service.checkEmail(this.accountForm.value.email);
  }

  /**
   * Makes the request to the backend to update the account details and refreshes the page
   * 
   * @param accountInformation object containing account info
   * @trigger on click of change button
   */
  async makeRequest(accountInformation: Record<string, any>): Promise<void> {
    // Tries to make the backend request
    try {
      await this.accountInfoService.changeAccountDetails(accountInformation);
      // Reloads the page, goes back to the info page
      this.modeChangeEvent.emit(0);
      // Emits a success toast
      this.toastCommService.emitChange([true, "Modification successful"]);
    } catch (e: any) {
      // Toast with error message
      this.toastCommService.emitChange([false, e.response.data]);
    }
  }

}
