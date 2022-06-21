// Veerle Furst
// Jarl Jansen

import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { InputCheckService } from 'app/services/input-check.service';
import { Router } from '@angular/router';
import { ToastCommService } from 'app/services/toast-comm.service';
import { AccountInfoService } from 'app/services/account-info.service';
import { environment } from 'environments/environment';

/**
 * Component responsible for logging in the user
 *
 * Consists of a the login page, and the login logic. Makes requests to the backend
 * in order to log the user in.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  /* Login form, data will be modified when user enters data in the login forms */
  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  /**
   * Initializes the formBuilder, InputCheckService and Router
   *
   * @param formBuilder instance of FormBuilder, used to get data from the html forms
   * @param service instance of InputCheckService, used to check input format
   * @param route instance of Router, used to redirect user after succesful log in
   *
   * @trigger component loaded
   */
  constructor(private formBuilder: FormBuilder,
    private service: InputCheckService,
    private route: Router,
    private toastCommService: ToastCommService,
    private accountInfoService: AccountInfoService) { }

  /**
   * Checks whether the input is valid, if it is valid, removes error message and calls login function
   * If input is not valid, changes errorMsg to display an error.
   *
   * @trigger user clicks login button
   *
   * @modifies this.errorMsg
   */
  loginSubmit() : void {
    // Checks input
    let not_empty = this.service.checkFilled(this.loginForm.value.username) &&
      this.service.checkFilled(this.loginForm.value.password);

    // Checks input
    if (!not_empty) {
      this.toastCommService.emitChange([false, "Please fill in a username and password"]);
      return;
    }
    this.checkLogin();
  }

  /**
   * Checks the filled in login details with the registered user account on the backend.
   * If the login details are valid, gets a session token in the response,
   * session token in stored in the browser session memory. Token used for authentication
   * in further communication with the backend.
   *
   * @trigger After clicking login button and basic input checks succeed
   *
   * @modifies errorMsg, route
   */
   async checkLogin() : Promise<void> {
    // Creates the object with the user filled info
    let loginInformation = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    await this.accountInfoService.loginUser(loginInformation);
  }
}
