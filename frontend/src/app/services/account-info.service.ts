import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';
import { User } from 'app/classes/user';
import { ToastCommService } from './toast-comm.service';

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
  constructor(private toastCommService: ToastCommService) {
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
  async userData(): Promise<any> {
    // User object
    let user;

    try {
      // Creates a request for the account information
      let response: any = await this.requestHandler.get("/account/information", {}, true);

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

  /**
   * Returns an array with User objects of all users in the application
   * by first requested that data from the database
   *
   * @returns array with all users in the app
   */
  async allUsersData(): Promise<Array<User>> {
    let users: User[] = [];

    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      let response = await this.requestHandler.get("/project/users", {}, true);

      // Loops over the response of the server and parses the response into the allMembers array
      for (let user of response) {
        // creates the object
        let responseUser = new User(user.id, user.username);
        // Sets email of new user
        responseUser.setEmail(user.email);
        // Sets the description of the new user
        responseUser.setDesc(user.description);
        // pushes the new user to the array of all users
        users.push(responseUser);
      }
    } catch (e) {
      // Throws an error if something goes wrong
      throw new Error("Could not get data from server");
    }
    return users;
  }

  /**
   * Makes a call to the server to delete the the user from the database
   *
   * @param toDel user to be deleted
   */
  async softDelUser(toDel: User): Promise<void> {
    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      await this.requestHandler.patch("/account/status", {"id": toDel.getId(), "status": "deleted"}, true);
    } catch(e) {
      // Throws an error if it goes wrong
      throw new Error("Could not get the data from server");
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
  async makeAuthRequest(): Promise<boolean> {
    try {
      // Makes the backend request to check whether the token is valid
      await this.requestHandler.get("/auth/check_login", {}, true);

      // Returns true if the token is valid
      return true;
    } catch (e: any) {
      this.toastCommService.emitChange([false, e.response.data]);
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
  async makeSuperAuthRequest(): Promise<boolean> {
    try {
      // Makes the backend request to check whether the token is valid
      await this.requestHandler.get("/auth/check_super_admin", {}, true);

      // Returns true if the token is valid
      return true;
    } catch (e) {
      // Returns false if the token is not valid
      return false;
    }
  }

  /**
   * Makes a post call to backend to register a user
   *
   * @params registerInformation, a record with the register information of the shape:
   * {
   *  username: the username of the user,
   *  email: the email of the user,
   *  description: the description of the user,
   *  password: the password of the user
   *  passwordR: the repeated instance of the user's password
   * }
   */
  async registerUser(registerInformation: Record<string, any>): Promise<any> {
    try {
      await this.requestHandler.post('auth/register', registerInformation, false);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Makes a request to the backend to login the user
   * 
   * @param user user account details
   * @returns whether the login was succesful
   * @throws error is an error occurs
   */
  async loginUser(user: Record<string, any>): Promise<any> {
    try {
      return await this.requestHandler.post('auth/login', user, false);
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * Makes request to the backend to edit password
   * 
   * @param passwordInformation object holding the old password, new password, and repeated new password
   * @throws error if an error occurs 
   */
  async changePassword(passwordInformation: Record<string, any>): Promise<void> {
    try {
      // Makes request to the backend
      await this.requestHandler.post("/account/editPassword", passwordInformation, true);
    } catch (e: any) {
      // Throws the error if one were to occur
      throw e;
    }
  }

  /**
   * Makes request to the backend to edit the account information
   * 
   * @param accountInformation object holding the id, username, email, description 
   * @throws error if an error occurs
   */
  async changeAccountDetails(accountInformation: Record<string, any>): Promise<void> {
    // Tries to make the backend request
    try {
      await this.requestHandler.post("/account/edit", accountInformation, true);
    } catch (e: any) {
      // catches the error and throws it again
      throw e;
    }
  }
}
