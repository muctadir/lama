import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';
import { User } from 'app/classes/user';

@Injectable({
  providedIn: 'root'
})
export class AccountInfoService {

  /**
   * Request the server for the user data and returns the user data in a User object
   * 
   * @returns User object with user data
   * @throws error when server request goes wrong 
   */
  async userData() : Promise<any> {
    let user;

    // Get the user authentication token
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);
    
    try {
      // Creates a request for the account information
      let response: any = requestHandler.get("/account/information", {}, true);

      // Waits on the request
      let result = await response;

      // Gets the user data from the database response and stores the data
      user = new User(result['id'], result['username']);
      user.setEmail(result['email']);
      user.setDesc(result['description']);
      user.setType(result['super_admin']);

      // Returns the user object
      return user;
      
    } catch (e) {
      // Throws an error if something goes wrong
      throw new Error("Could not get data from server");
    }
  }
}
