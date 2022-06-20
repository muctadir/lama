import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/classes/user';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';
import { AccountInfoService } from 'app/services/account-info.service';
import { ToastCommService } from 'app/services/toast-comm.service';

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
  constructor(private accountService: AccountInfoService,
    private toastCommService: ToastCommService, 
    private modalService: NgbModal) { }

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
  async modeChange(newMode: number): Promise<void> {
    // Changes page
    this.mode = newMode;
    // Updates the user data
    await this.getAllUsers();
  }

  /**
   * Requests the backend for all users within the application, using the accountService
   * 
   * @modifies @users
   * @trigger on component creation, when mode is changed
   */
  async getAllUsers(): Promise<void> {
    try {
      // Gets the user data
      this.users = await this.accountService.allUsersData();
    } catch(e) {
      console.log(e);
    }
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
    let modalRef = this.modalService.open(ConfirmModalComponent, {});

    // Listens for an event emitted by the modal
    modalRef.componentInstance.confirmEvent.subscribe(async ($e: boolean) => {
      // If a confirmEvent = true is emitted we delete the user
      if($e) {
        try {
          // Makes the call to delete the user
          await this.accountService.softDelUser(deluser);
          // Shows confirmation
          this.toastCommService.emitChange([true, "User deleted successfully"]);
          // Reloads the user data
          await this.getAllUsers();
        } catch {
          // Logs the error if one were to occur
          this.toastCommService.emitChange([false, "Something went wrong"])
        }
      }
    })
  }
}
