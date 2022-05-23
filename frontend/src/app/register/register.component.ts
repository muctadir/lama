import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { InputCheckService } from '../input-check.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  /* String, when register data is incorrect will contain error */
  errorMsg = "";

  constructor(private formBuilder: FormBuilder, private service: InputCheckService) { }

  /* Register form, data will be modified on register */
  registerForm = this.formBuilder.group({
    username: '',
    email: '',
    password: '',
    description: ''
  });

  /**
   * Checks whether the username/password is nonempty, and checks whether the email is valid.
   * If input is valid, calls method registering the user.
   */
  onRegister(){
    // Checks input
    let not_empty = this.service.checkFilled(this.registerForm.value.username) && 
                this.service.checkFilled(this.registerForm.value.password) &&
                this.service.checkEmail(this.registerForm.value.email);

    // chooses desired behaviour based on validity of input
    if (not_empty){
      this.errorMsg = "";
      this.register()
    } else {
      this.errorMsg = "Invalid username, password or email.";
    }
  }

  /* TODO: implement this register function */
  register() {
    console.log(this.registerForm.value);
  }

}
