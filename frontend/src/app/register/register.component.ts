// Veerle Furst

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import { AccountInformationFormComponent } from '../account-information-form/account-information-form.component';
import { InputCheckService } from '../input-check.service';
import {Router} from '@angular/router';

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
   */
  constructor(private service: InputCheckService, private route: Router) { }

  /**
   * Checks whether the username/password is nonempty, and checks whether the email is valid.
   * If input is valid, calls method registering the user.
   * 
   * @modifies errorMsg
   */
  onRegister(){
    // Checks input
    let not_empty = this.service.checkFilled(this.username.value) && 
                this.service.checkFilled(this.password.value) &&
                this.service.checkFilled(this.passwordR.value) &&
                this.service.checkEmail(this.email.value);

    // chooses desired behaviour based on validity of input
    if (not_empty){
      // Needed to not show the error
      this.errorMsg = "";
      // calls method responsible for the actual registering
      this.register()
    } else {
      this.errorMsg = "Fill in username, password and email.";
    }
  }

  /* Register the user */
  register() {

    // Information needed for backend
    let registerInformation = {
      username: this.username.value,
      email: this.email.value,
      description: this.desc.value,
      password: this.password.value,
      passwordR: this.passwordR.value,
    }

    // Post to backend
    const response = axios.post("http://127.0.0.1:5000/auth/register", registerInformation)
    .then(response =>{
      this.route.navigate(['/login']);

      // Print the created message
      this.errorMsg = response.data;
    })
    .catch(error =>{
      // Print the error message
      this.errorMsg = error.response.data;
    })

  }

}
