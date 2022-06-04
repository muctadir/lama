import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-account-information-form',
  templateUrl: './account-information-form.component.html',
  styleUrls: ['./account-information-form.component.scss']
})

export class AccountInformationFormComponent implements OnInit {
  @Input () userInfo: User | undefined;

  errorMsg : string = "";

  public username: FormControl;
  public email: FormControl;
  public password: FormControl;
  public passwordVerify: FormControl;
  public description: FormControl;

  constructor() {
    this.username = new FormControl();
    this.email = new FormControl();
    this.password= new FormControl();
    this.passwordVerify = new FormControl();
    this.description = new FormControl();
  }

  ngOnInit(): void {
    if (this.userInfo?.getUsername() != undefined && this.userInfo?.getUsername().length != 0) {
      this.username.setValue(this.userInfo.getUsername());
    }

    if (this.userInfo?.getEmail() != undefined){ //&& this.userInfo?.getEmail().length != 0) {
      this.email.setValue(this.userInfo.getEmail());
    }

    if (this.userInfo?.getDescription() != undefined){ //&& this.userInfo?.getDescription().length != 0) {
      this.description.setValue(this.userInfo.getDescription());
    }
  }


}
