import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RequestHandler } from './classes/RequestHandler';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  /**
   * Initializes the router 
   * 
   * @param router instance of router
   */
  constructor(private router: Router) { }

  /**
   * Function which returns whether the user is allowed to visit the page, 
   * also redirects to the login page if the user is not allowed to visit the page
   * 
   * @returns whether user is allowed to visit the page
   * @trigger user visits page with canActivate guard
   */
  async canActivate(): Promise<boolean> {
    // Makes call to backend checking whether user token is valid
    if(await this.makeAuthRequest()) {
      // Returns that the user is allowed to view the page
      return true
    } else {
      // Redirects to the login page
      this.router.navigate(["/login"]);
      // Blocks the user from viewing the page
      return false
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
    // Gets the token from the browser session storage
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Creates an instance of the request handler
    let requestHandler = new RequestHandler(token);

    try {
      // Makes the backend request to check whether the token is valid
      let response: any = requestHandler.get("/auth/check_login", {}, true);

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