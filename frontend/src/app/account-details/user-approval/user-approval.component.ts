import { Component, OnInit } from '@angular/core';
import { User } from 'app/classes/user';
import { AccountInfoService } from 'app/services/account-info.service';
import { ToastCommService } from 'app/services/toast-comm.service';

@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.scss']
})
export class UserApprovalComponent implements OnInit {
  /* Account data of the user */
  user: any;

  /* All users within the application */
  users: User[] = [];

  constructor(private accountService: AccountInfoService,
    private toastCommService: ToastCommService) { }

  /**
   * Requests the server for the data of all users in the application
   * 
   * @trigger on component creation
   * @modifies @users
   */
  async ngOnInit(): Promise<void> {
    await this.getPendingUsers();
  }

  /**
   * Requests the backend for all users within the application, using the accountService
   * 
   * @modifies @users
   * @trigger on component creation, when mode is changed
   */
  async getPendingUsers(): Promise<void> {
    try {
      // Gets the user data
      this.users = await this.accountService.pendingUsersData();
    } catch (e) {
      // Makes an error toast
      this.toastCommService.emitChange([false, "An error occured when gathering data from the server"]);
    }
  }

  /**
   * When the approve button is clicked for one of the users, stores the user object
   * And changes the mode to display the edit page
   * 
   * @param editUser user whose account details will be modified
   */
  async approveUser(editUser: User): Promise<void> {
    try {
      // Makes the call to delete the user
      await this.accountService.approveUser(editUser);
      // Shows confirmation
      this.toastCommService.emitChange([true, "User approved successfully"]);
      // Reloads the user data
      await this.getPendingUsers();
    } catch {
      // Logs the error if one were to occur
      this.toastCommService.emitChange([false, "Something went wrong"])
    }
  }

}
