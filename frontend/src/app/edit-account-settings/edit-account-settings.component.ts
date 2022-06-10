//@Author Jarl Jansen

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RequestHandler } from 'app/classes/RequestHandler';
import { User } from 'app/classes/user';
import { Router } from '@angular/router';
import { InputCheckService } from '../input-check.service';

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

  /* Error message displayed when user modifies settings incorrectly */
  errorMsg: string = ""; 

  /* Form displayed on the page containing username, email and description */
  accountForm = this.formBuilder.group({
    username: "",
    email: "",
    description: ""
  });

  /**
   * Initializes the form builder
   * 
   * @param formBuilder instance of form builder
   */
  constructor(private formBuilder: FormBuilder, private router: Router) { }

  /**
   * When the userAccount gets modified it ensures that this change is communicated 
   * to the local variables of this component.
   * 
   * @trigger change occurs in the component
   * @modifies accountForm
   */
  ngOnChanges() {
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
  changeInformation() {
    // Creates object which will be send to the backend
    let accountInformation: Record<string, any> = {};
    
    // Enters the data into the object
    accountInformation = {
      "username" : this.accountForm.value.username,
      "description" : this.accountForm.value.description,
      "email": this.accountForm.value.email
    };

    // Checks the input of the user
    let validInput: boolean = this.checkInput();

    // Sends request to backend if input is valid, otherwise displays error message
    if (validInput) {
      // Calls function responsible for making the request to the backend
      this.makeRequest(accountInformation)
    } else {
      // Displays an error message to the user 
      this.errorMsg = "Please enter valid input in all fields";
    }
  }

  /**
   * Checks the input of the accountForm about whether its content is correct.
   * 
   * @returns whether input is valid
   * @trigger on click of change button
   */
  checkInput() : boolean {
    // Initializes inputCheckService
    let service : InputCheckService = new InputCheckService();

    // Checks input
    return service.checkFilled(this.accountForm.value.username) && 
      service.checkFilled(this.accountForm.value.email) &&
      service.checkEmail(this.accountForm.value.email);
  }

  /**
   * Makes the request to the backend to update the account details and refreshes the page
   * 
   * @param accountInformation object containing account info
   * @trigger on click of change button
   */
  async makeRequest(accountInformation: Record<string, any>) {
    // Gets the authentication toekn
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Initializes request handler and makes request
    let requestHandler: RequestHandler = new RequestHandler(token);
    try {
      let response: any = requestHandler.post("/account/edit", accountInformation, true);

      // Waits on the request
      let result = await response;

      if (result.includes("Updated succesfully")) {
        // Reloads the page, goes back to the info page
        this.modeChangeEvent.emit(0);
      }
      
      // Resets error message
      this.errorMsg = "";
    } catch(e) {
      // Displays the error message
      this.errorMsg = "Please enter valid details";
    }

    
  }

}
