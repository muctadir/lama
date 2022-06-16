import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/classes/user';

/**
 * Reusable component holding 5 form fields, username, email, password, password repeated, description
 * Used in context of user account.
 */
@Component({
  selector: 'app-account-information-form',
  templateUrl: './account-information-form.component.html',
  styleUrls: ['./account-information-form.component.scss']
})

export class AccountInformationFormComponent implements OnInit {
  /* User info that should be displayed in the forms */
  @Input () userInfo: User | undefined;

  /* Username form of the user account */
  public username: FormControl;
  /* Email form of the user account */
  public email: FormControl;
  /* Password form of the user account */
  public password: FormControl;
  /* Repeated password form of the user account */
  public passwordVerify: FormControl;
  /* Description form of the user account */
  public description: FormControl;

  /**
   * Initializes the forms with a FormControl object.
   * 
   * @trigger on load
   */
  constructor() {
    this.username = new FormControl();
    this.email = new FormControl();
    this.password= new FormControl();
    this.passwordVerify = new FormControl();
    this.description = new FormControl();
  }

  /**
   * Sets the value of the username formfield, email formfield, and description formfield
   * if the @userInfo object has a non-empty value for these fields.
   * 
   * @trigger on component load
   * @modifies username, email, description
   */
  ngOnInit(): void {
    // Sets the username if it is defined and nonempty
    if (this.userInfo?.getUsername() != undefined && this.userInfo?.getUsername().length != 0) {
      this.username.setValue(this.userInfo.getUsername());
    }

    // Sets the email if it is defined
    if (this.userInfo?.getEmail() != undefined){
      this.email.setValue(this.userInfo.getEmail());
    }

    // Sets the description if it is defined
    if (this.userInfo?.getDesc() != undefined){ 
      this.description.setValue(this.userInfo.getDesc());
    }
  }
}
