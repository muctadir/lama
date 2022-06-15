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

  users: User[] = [];

  /* Page currently getting viewed, 0 = page with all accounts, 1 = edit page, 2 = edit password page */
  mode: number = 0;

  constructor(private accountService: AccountInfoService) { }

  async ngOnInit() {
    await this.getAllUsers();
  }

  /**
   * Changes the page that is getting displayed to the user
   * And reloads user data
   * 
   * @param newMode new page to displayed
   * @modifies mode
   */
   modeChange(newMode: number) : void {
    // Changes page
    this.mode = newMode;
  }

  async getAllUsers() : Promise<void> {
    this.users = await this.accountService.allUsersData();
  }

  editUser(editUser: User) {
    this.user = editUser;
    this.mode = 1;
  }
  softDelete(deluser: User) {
    console.log(deluser);
  }

}
