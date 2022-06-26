// Veerle Furst
// Jarl Jansen

import { Component } from '@angular/core';
import { AccountInfoService } from 'app/services/account-info.service';
import { ToastCommService } from 'app/services/toast-comm.service';

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

  /**
   * Initializes the services which will be used by this component
   * 
   * @param accountService instance of AccountInfoService
   * @param toastCommService instance of ToastCommService
   */
  constructor(private accountService: AccountInfoService,
    private toastCommService: ToastCommService) {}

  /**
   * Calls function responsible for getting the user data from the backend
   * 
   * @trigger on component load
   */
  ngOnInit() : void {
    this.getInformation()
  }

  /**
   * Changes the page that is getting displayed to the user
   * And reloads user data
   * 
   * @param newMode new page to displayed
   * @modifies mode
   * @trigger modeChangeEvent happens
   */
  modeChange(newMode: number) : void{
    // Changes page
    this.mode = newMode;
    // Reloads user data
    this.getInformation();
  }

  /**
   * Queries backend for the user account details
   * 
   * @modifies user
   */
  async getInformation() : Promise<void> {
    // Tries to get the user account details from the backend
    try {
      this.user = await this.accountService.userData();
    } catch(e) {
      // If an error occurs emits a toast saying an error occured.
      this.toastCommService.emitChange([false, "An error occured when requesting the server for user data."]);
    }
  }
}
