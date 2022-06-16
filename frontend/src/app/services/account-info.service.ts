import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';
import { User } from 'app/classes/user';

@Injectable({
  providedIn: 'root'
})
export class AccountInfoService {
  /* Instance of the request handler used for communication with server */
  requestHandler: RequestHandler;

  /**
   * Gets the token from the session storage and creates the requestHandler with the token
   * 
   * @modifies @requestHandler
   * @trigger on creation
   */
  constructor() {
    // Gets the token
    let token = sessionStorage.getItem('ses_token');

    // Initializes the request handler
    this.requestHandler = new RequestHandler(token);
  }

  /**
   * Request the server for the user data and returns the user data in a User object
   * 
   * @returns User object with user data
   * @throws error when server request goes wrong 
   */
  async userData() : Promise<any> {
    // User object
    let user;
    
    try {
      // Creates a request for the account information
      let response: any =  await this.requestHandler.get("/account/information", {}, true);

      // Gets the user data from the database response and stores the data
      user = new User(response['id'], response['username']);
      user.setEmail(response['email']);
      user.setDesc(response['description']);
      user.setType(response['super_admin']);

      // Returns the user object
      return user;
      
    } catch (e) {
      // Throws an error if something goes wrong
      throw new Error("Could not get data from server");
    }
  }

  async allUsersData(): Promise<Array<User>> {
    let users: User[] = [];

    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      let response: any = await this.requestHandler.get("/project/users", {}, true);

      // Loops over the response of the server and parses the response into the allMembers array
      for (let user of response) {
        // creates the object
        let newUser = new User(user.id, user.username);
        // passes additional data to the newly created user object
        newUser.setEmail(user.email);
        newUser.setDesc(user.description);
        // pushes the new user to the array of all users
        users.push(newUser);
      }
    } catch(e) {
      // Throws an error if something goes wrong
      throw new Error("Could not get data from server");
    }
    return users;
  }

  async softDelUser(toDel: User) : Promise<any> {
    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      await this.requestHandler.post("/account/soft_del", {"id": toDel.getId()}, true);

      return "success";
    } catch(e) {
      // Throws an error if something goes wrong
      throw new Error("Could not get data from server");
    }
  }

  /**
   * Makes a request to the backend with the session token
   * The backend returns an error if the session token is not valid
   * The backend returns a success package if it is valid
   * Returns whether the backend response was valid or not valid 
   * 
   * @returns whether authentication token is valid
   */
  async makeAuthRequest() : Promise<boolean> {
    try {
      // Makes the backend request to check whether the token is valid
      let response: any = this.requestHandler.get("/auth/check_login", {}, true);

      // Waits on the request
      await response;

      // Returns true if the token is valid
      return true;
    } catch(e) {
      // Returns false if the token is not valid
      return false;
    }
  }

  /**
   * Makes a request to the backend with the session token
   * The backend returns an error if the session token is not valid
   * The backend returns a success package if it is valid
   * Returns whether the backend response was valid or not valid 
   * 
   * @returns whether authentication token is valid
   */
   async makeSuperAuthRequest() : Promise<boolean> {
    try {
      // Makes the backend request to check whether the token is valid
      let response: any = this.requestHandler.get("/auth/check_super_admin", {}, true);

      // Waits on the request
      await response;

      // Returns true if the token is valid
      return true;
    } catch(e) {
      // Returns false if the token is not valid
      return false;
    }
  }
}
