// Veerle Furst
// Jarl Jansen

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import { AccountInformationFormComponent } from '../account-information-form/account-information-form.component';
import { InputCheckService } from 'app/services/input-check.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  /* variables which will hold the user input in the forms */
  username!: FormControl;
  email!: FormControl;
  password!: FormControl;
  passwordR!: FormControl;
  desc!: FormControl;

  /* Gets the data from the child component (form with the input fields) */
  @ViewChild(AccountInformationFormComponent)
  set tester(directive: AccountInformationFormComponent) {
    this.username = directive.username;
    this.email = directive.email;
    this.password = directive.password;
    this.passwordR = directive.passwordVerify;
    this.desc = directive.description;
  }

  /* String, when register data is incorrect will contain error */
  errorMsg = "";

  /**
   * Initializes instance of InputCheckService
   * 
   * @param service instance of InputCheckService
   * @param route instance of Router
   */
  constructor(private service: InputCheckService, private route: Router) { }

  /**
   * Checks whether the username/password is nonempty, and checks whether the email is valid.
   * If input is valid, calls method registering the user.
   * 
   * @modifies errorMsg
   * @trigger register button is clicked
   */
  onRegister() : void {
    // Checks input
    let not_empty = this.service.checkFilled(this.username.value) && 
      this.service.checkFilled(this.password.value) &&
      this.service.checkFilled(this.passwordR.value) &&
      this.service.checkEmail(this.email.value);

    // Chooses desired behaviour based on validity of input
    if (not_empty){
      // Needed to not show the error
      this.errorMsg = "";
      // Calls method responsible for the actual registering
      this.register()
    } else {
      // Case where username, password or email will not filled in / valid
      this.errorMsg = "Fill in username, password and valid email.";
    }
  }

  /**
   * Communicates with the backend to register the user, if the user details
   * do not satisfy requirments an error is returned and displayed to the user.
   * If the user details are fine, then the user is redirected to the login page.
   * 
   * @trigger register button clicked, valid input
   * @modifies errorMsg
   */
  register() : void {
    // Information needed for backend
    let registerInformation = {
      username: this.username.value,
      email: this.email.value,
      description: this.desc.value,
      password: this.password.value,
      passwordR: this.passwordR.value,
    }

    // Post to backend
    axios.post("http://127.0.0.1:5000/auth/register", registerInformation)
    .then(response =>{
      // Print the created message
      this.errorMsg = response.data;

      // Reroutes the user to the login page
      this.route.navigate(['/login']);
    })
    .catch(error =>{
      // Print the error message
      this.errorMsg = "Bad input data";
    })

  }

}
