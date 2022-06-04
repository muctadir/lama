// Veerle Furst
// Jarl Jansen

import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { InputCheckService } from '../input-check.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /* String, when login data is incorrect will contain error */
  errorMsg = "";

  /* Constructor which gets the formBuilder from Angular forms */
  constructor(private formBuilder: FormBuilder, private service: InputCheckService, private route: Router) { }

  /* Login form, data will be modified on login */
  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  /**
   * Checks whether the input is valid, if it is valid, removes error message and calls login function
   * If input is not valid, changes errorMsg to display an error.
   * @modifies this.errorMsg
   */
  loginSubmit() : void {
    // checks input
    let not_empty = this.service.checkFilled(this.loginForm.value.username) && 
                this.service.checkFilled(this.loginForm.value.password);
                
    // chooses desired behaviour based on validity of input
    if (not_empty) {
      this.errorMsg = "";
      // Check the login credentials
      this.checkLogin();
    } else {
      this.errorMsg = "Username or password not filled in";
    }
  }

  
  /* Method responsible for verifying details with backend */
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

      // Print the created message
      this.errorMsg = "";
    })
    .catch(error =>{
      // Print the error message
      this.errorMsg = error.response.data;
    })
  }
}
