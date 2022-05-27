import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AccountInformationFormComponent } from '../account-information-form/account-information-form.component';
import { InputCheckService } from '../input-check.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  /* variables which will hold the user input in the forms */
  username!: FormControl;
  email!: FormControl;
  password!: FormControl;
  passwordR!: FormControl;
  desc!: FormControl;

  /* Gets the data from the child component (form with the input fields) */
  @ViewChild(AccountInformationFormComponent)
  set tester(directive: AccountInformationFormComponent) {
    this.username = directive.username;
    this.email = directive.email;
    this.password = directive.password;
    this.passwordR = directive.passwordVerify;
    this.desc = directive.description;
  }

  /* String, when register data is incorrect will contain error */
  errorMsg = "";

  /**
   * Initializes instance of InputCheckService
   * 
   * @param service instance of InputCheckService
   */
  constructor(private service: InputCheckService) { }

  /**
   * Checks whether the username/password is nonempty, and checks whether the email is valid.
   * If input is valid, calls method registering the user.
   * 
   * @modifies errorMsg
   */
  onRegister(){
    // Checks input
    let not_empty = this.service.checkFilled(this.username.value) && 
                this.service.checkFilled(this.password.value) &&
                this.service.checkFilled(this.passwordR.value) &&
                this.service.checkEmail(this.email.value);

    // chooses desired behaviour based on validity of input
    if (not_empty){
      this.errorMsg = "";
      // calls method responsible for the actual registering
      this.register()
    } else {
      this.errorMsg = "Invalid username, password or email.";
    }
  }

  /* TODO: implement this register function */
  register() {
    console.log(this.username.value);
    console.log(this.email.value);
    console.log(this.password.value);
    console.log(this.passwordR.value);
    console.log(this.desc.value);
  }

}
