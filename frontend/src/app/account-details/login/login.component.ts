// Veerle Furst
// Jarl Jansen

import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { InputCheckService } from 'app/services/input-check.service';
import { Router } from '@angular/router';

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

  /* String, when login data is incorrect will contain error */
  errorMsg = "";

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
  constructor(private formBuilder: FormBuilder, private service: InputCheckService, private route: Router) { }

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
                
    // Chooses desired behaviour based on validity of input
    if (not_empty) {
      this.errorMsg = "";
      // Check the login credentials
      this.checkLogin();
    } else {
      // Displays error message
      this.errorMsg = "Username or password not filled in";
    }
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
  checkLogin() : void {
    // Creates the object with the user filled info 
    let loginInformation = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    // Let the backend check login
    axios.post("http://127.0.0.1:5000/auth/login", loginInformation)
    .then(response =>{     
      // Gets the token from the response header
      let token = response.headers["u_id_token"];

      // Stores the session token, can get the token using sessionStorage.getItem('ses_token');
      sessionStorage.setItem('ses_token', token);

      // Navigates to the home page
      this.route.navigate(['/home']);

      // Resets error message to now display
      this.errorMsg = "";
    })
    .catch(error =>{
      // Print the error message: "Invalid username or password"
      this.errorMsg = error.response.data;
    })
  }
}
