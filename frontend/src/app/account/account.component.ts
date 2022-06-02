// Veerle Furst

import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import axios from 'axios';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent {

  // Placeholder for the current user
  user: any;

  edit: boolean = false;

  editPassword: boolean = false;

  errorMsg = "";

  constructor(private route: Router){}

  ngOnInit(){
    // Get the information of the user on loading the page
    this.getInformation()
  }

  // Get the information of the user
  getInformation(){
    // Get the token of the session
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){
      // Get from the backend
      const response = axios.get("http://127.0.0.1:5000/account/information", {
        headers: {
          'u_id_token': token
        }
      })
      .then(response =>{
        // Get the response data
        let accountInformation = response.data;
        // Create a new user with the response data
        this.user = new User(
          accountInformation['id'],
          accountInformation['username'],
          accountInformation['email'],
          accountInformation['description']
        )
      })
      .catch(error =>{
        // Show the error 
        this.errorMsg = error.response.data
      })
    }
  }


  // Function for getting all form elements
  getFormElements(form:HTMLFormElement): Record<string, string>{
    // Make a dictionary for all values
    let params: Record<string, string> = {};
    // For loop for adding the params to the list
    for (let i = 0; i < form.length; i++) { 
      // Add them to dictionary
      let param = form[i] as HTMLInputElement; // Typecast
      params[param.name] = param.value;
    }
    // Return the dictionary of values
    return params;
  }

  // Function for changing the information when edited
  changeInformation(){

    // Get the form with all information
    const post_form: HTMLFormElement = (document.querySelector("#accountEditForm")!);

    // Get all input fields
    const inputFields = document.querySelectorAll("input");
    // Check if the input fields are filled in
    const validInputs = Array.from(inputFields).filter( input => input.value == "");

     // Check validity of filled in form
     if (validInputs.length == 0) {

      // Params of the name, email and description
      let params = this.getFormElements(post_form);

      // Way to get information to backend
      let accountInformation: Record<string, any> = {};
      // Project information
      accountInformation = {
        "username" : params['username'],
        "description" : params['description'],
        "email": params["email"]
      };

      // Get the session token
      let token: string | null  = sessionStorage.getItem('ses_token');
      if (typeof token === "string"){
        // Post to the backend
        const response = axios.post("http://127.0.0.1:5000/account/edit", accountInformation, {
          headers: {
            'u_id_token': token
          }
        })
        .then(response => {          
          // Reloads the page
          window.location.reload();
        })
        .catch(error => {
          // Show the error
          this.errorMsg = error.response.data
        })
      }
    } else {
      this.errorMsg = "Fill in all fields"
    }
  }


  editPasswordF(){
    // Get the form with all information
    const post_form: HTMLFormElement = (document.querySelector("#passwordEditForm")!);

    // Get all input fields
    const inputFields = document.querySelectorAll("input");
    // Check if the input fields are filled in
    const validInputs = Array.from(inputFields).filter( input => input.value == "");

     // Check validity of filled in form
     if (validInputs.length == 0) {

      // Params of the name, email and description
      let params = this.getFormElements(post_form);

      // Check if passwords are equal
      if(params["newPassword"]==params["newPasswordR"]){

        // Way to get information to backend
        let passwordInformation: Record<string, any> = {};
        // Project information
        passwordInformation = {
          "password" : params['password'],
          "newPassword": params["newPassword"]
        };

        // Get the session token
        let token: string | null  = sessionStorage.getItem('ses_token');
        if (typeof token === "string"){
          // Post to the backend
          const response = axios.post("http://127.0.0.1:5000/account/editPassword", passwordInformation, {
            headers: {
              'u_id_token': token
            }
          })
          .then(response => {          
            // Reloads the page
            window.location.reload();
          })
          .catch(error => {
            // Show the error
            this.errorMsg = error.response.data
          })
        }
      } else {
        this.errorMsg = "Passwords are not equal";
      }
    } else {
      this.errorMsg = "Fill in all fields";
    }
  }
}
