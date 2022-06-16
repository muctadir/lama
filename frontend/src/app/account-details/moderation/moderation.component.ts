import { Component } from '@angular/core';
import { User } from 'app/classes/user';
import { AccountInfoService } from 'app/services/account-info.service';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent {
  /* Account data of the user */
  user: any;

  /* All users within the application */
  users: User[] = [];

  /* Page currently getting viewed, 0 = page with all users, 1 = edit page account details, 2 = edit password page */
  mode: number = 0;

  /**
   * Initializes AccountInfoService
   * 
   * @param accountService instance of the accountInfoService
   * @trigger on component creation
   */
  constructor(private accountService: AccountInfoService) { }

  /**
   * Requests the server for the data of all users in the application
   * 
   * @trigger on component creation
   * @modifies @users
   */
  async ngOnInit(): Promise<void> {
    await this.getAllUsers();
  }

  /**
   * Changes the page that is getting displayed to the user
   * And reloads user data
   * 
   * @param newMode new page to displayed
   * @modifies mode
   */
  modeChange(newMode: number): void {
    // Changes page
    this.mode = newMode;
    // Updates the user data
    this.getAllUsers();
  }

  /**
   * Requests the backend for all users within the application, using the accountService
   * 
   * @modifies @users
   * @trigger on component creation, when mode is changed
   */
  async getAllUsers(): Promise<void> {
    this.users = await this.accountService.allUsersData();
  }

  /**
   * When the edit button is clicked for one of the users, stores the user object
   * And changes the mode to display the edit page
   * 
   * @param editUser user whose account details will be modified
   * @modifies @user @mode
   */
  editUser(editUser: User): void {
    // stores the user object
    this.user = editUser;
    // changes the mode
    this.mode = 1;
  }

  /**
   * Makes the call to soft-delete a user, and updates the displayed users afterwards
   * 
   * @param deluser user to be deleted
   * @trigger delete button is clicked for @deluser
   */
  async softDelete(deluser: User): Promise<void> {
    try {
      // Makes the call to delete the user
      await this.accountService.softDelUser(deluser);
      // Reloads the user data
      await this.getAllUsers();
    } catch(e) {
      // Logs the error if one were to occur
      console.log(e);
    }
  }

}
