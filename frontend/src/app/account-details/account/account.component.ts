// Veerle Furst
// Jarl Jansen
import { Component } from '@angular/core';
import { AccountInfoService } from 'app/services/account-info.service';

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
   */
  async getInformation(){
    let accountService = new AccountInfoService();

    try {
      this.user = await accountService.userData();
      this.errorMsg = "";
    } catch(e) {
      this.errorMsg = "An error occured when requesting the server for user data.";
    }
  }
}
