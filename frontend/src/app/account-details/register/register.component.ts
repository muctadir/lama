// Veerle Furst
// Jarl Jansen

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AccountInformationFormComponent } from '../account-information-form/account-information-form.component';
import { InputCheckService } from 'app/services/input-check.service';
import { AccountInfoService } from 'app/services/account-info.service';
import { Router } from '@angular/router';
import { ToastCommService } from 'app/services/toast-comm.service';

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

  /**
   * Initializes instance of InputCheckService
   * 
   * @param service instance of InputCheckService
   * @param accountInfoService instance of AccountInfoService
   * @param route instance of Router
   * @param toastCommService instance of ToastCommService
   */
  constructor(private service: InputCheckService,
    private accountInfoService: AccountInfoService,
    private route: Router,
    private toastCommService: ToastCommService) { }

  /**
   * Checks whether the username/password is nonempty, and checks whether the email is valid.
   * If input is valid, calls method registering the user.
   * 
   * @trigger register button is clicked
   */
  onRegister(): void {
    // Checks input
    let not_empty = this.service.checkFilled(this.username.value) &&
      this.service.checkFilled(this.password.value) &&
      this.service.checkFilled(this.passwordR.value) &&
      this.service.checkFilled(this.email.value)

    // Gives popup if one of the fields is not filled in
    if (!not_empty) {
      // Emits an error toast
      this.toastCommService.emitChange([false, "Please enter input in all input fields"]);
      return;
    }

    let valid_email = this.service.checkEmail(this.email.value);
    // Gives popup if email is invalid
    if (!valid_email) {
      // Emits an error toast
      this.toastCommService.emitChange([false, "Please enter a valid email address"]);
      return;
    }

    this.register()
  }

  /**
   * Communicates with the backend to register the user, if the user details
   * do not satisfy requirements an error is displayed to the user.
   * If the user details are fine, then the user is redirected to the login page.
   * 
   * @trigger register button clicked, valid input
   */
  async register(): Promise<void> {
    // Information needed for backend
    let registerInformation = {
      username: this.username.value,
      email: this.email.value,
      description: this.desc.value,
      password: this.password.value,
      passwordR: this.passwordR.value,
    }

    // Tries to make a request to the backend
    try {
      // Makes the register request to the backend
      await this.accountInfoService.registerUser(registerInformation)
      // Displays a success toast
      this.toastCommService.emitChange([true, "Account created successfully!"]);
      // Reroutes the user to the login page
      this.route.navigate(['/login']);
    } catch(e: any) {
      // Shows an error in the toast
      this.toastCommService.emitChange([false, e.response.data]);
    }
  }
}
