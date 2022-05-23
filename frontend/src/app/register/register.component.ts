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

  /* Checks whether the username/password is nonempty, and checks whether the email is valid 
    Calls method responsible for registering if input is valid */
  onRegister(){
    let not_empty = this.service.checkFilled(this.registerForm.value.username) && 
                this.service.checkFilled(this.registerForm.value.password) &&
                this.service.checkEmail(this.registerForm.value.email);

    // Calls the registeration function (TODO), or displays an error.
    if (not_empty){
      this.errorMsg = "";
      console.log(this.registerForm.value);
    } else {
      this.errorMsg = "Invalid username, password or email.";
    }
  }

}
