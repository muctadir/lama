// Author: Jarl Jansen
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountInfoService } from './account-info.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  /**
   * Initializes the router 
   * 
   * @param router instance of router
   */
  constructor(private router: Router, private accountService: AccountInfoService) { }

  /**
   * Function which returns whether the user is allowed to visit the page, 
   * also redirects to the login page if the user is not allowed to visit the page
   * 
   * @returns whether user is allowed to visit the page
   * @trigger user visits page with canActivate guard
   */
  async canActivate(): Promise<boolean> {
    // Makes call to backend checking whether user token is valid
    if (await this.accountService.makeAuthRequest()) {
      // Returns that the user is allowed to view the page
      return true
    } else {
      // Redirects to the login page
      this.router.navigate(["/login"]);
      // Blocks the user from viewing the page
      return false
    }
  }


}