/* @author Jarl */
 
import { Component, NgModule } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent {

  /**
   * Initializes the NgbActiveModal and the router
   * 
   * @param activeModal instance of NgbActiveModal
   * @param route instance of Router
   */
  constructor(public activeModal: NgbActiveModal, private route: Router) { }

  /**
   * Deletes the session token of the user and redirects to the login page
   * 
   * @modifies sessionStorage 
   */
  logOut() : void {
    // Drops the session token
    sessionStorage.removeItem('ses_token');

    // Navigates to the login page
    this.route.navigate(['/login'])
    
    // Closes the modal
    this.activeModal.close();
  }

}
