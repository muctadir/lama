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
    // User object
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


  
  async allUsersData(): Promise<Array<User>> {
    let users: User[] = [];

    // Get the user authentication token
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);

    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      let response: any = requestHandler.get("/project/users", {}, true);

      // Waits on the request
      let result = await response;

      // Loops over the response of the server and parses the response into the allMembers array
      for (let user of result) {
        // creates the object
        let newUser = new User(user.id, user.username);
        // passes additional data to the newly created user object
        newUser.setEmail(user.email);
        newUser.setDesc(user.description);
        // pushes the new user to the array of all users
        users.push(newUser);
      }
    } catch(e) {
      // Outputs an error
      console.log("An error occured when loading data from the server");
    }

    return users;
  }
}
