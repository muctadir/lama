// Veerle Furst
// Jarl Jansen

import { Component } from '@angular/core';
import { User } from 'app/classes/user';
import { RequestHandler } from 'app/classes/RequestHandler';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent {

  /* Account data of the user */
  user: any;

  /* Page currently getting viewed, 0 = info page, 1 = edit page, 2 = edit password page */
  mode: number = 0;

  /* Error message that is displayed to the user */
  errorMsg: string = "";

  /**
   * Calls function responsible for getting the user data from the backend
   * 
   * @trigger on component load
   */
  ngOnInit(){
    this.getInformation()
  }

  /**
   * Changes the page that is getting displayed to the user
   * And reloads user data
   * 
   * @param newMode new page to displayed
   * @modifies mode
   */
  modeChange(newMode: number) {
    // Changes page
    this.mode = newMode;
    // Reloads user data
    this.getInformation();
  }

  /**
   * Queries backend for the user account details
   * 
   * @modifies user
   * 
   * TODO: error handling code
   */
  async getInformation(){
    // Get the user authentication token
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);
    // Creates a request for the account information
    let response: any = requestHandler.get("/account/information", {}, true);

    // Waits on the request
    let result = await response;

    // Gets the user data from the database response and stores the data
    this.user = new User(
      result['id'],
      result['username']
    )
    this.user.setEmail(result['email']);
    this.user.setDesc(result['description']);
  }

}
