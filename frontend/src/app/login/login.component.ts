import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { InputCheckService } from '../input-check.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /* String, when login data is incorrect will contain error */
  errorMsg = "";

  /* Constructor which gets the formBuilder from Angular forms */
  constructor(private formBuilder: FormBuilder, private service: InputCheckService) { }

  /* Login form, data will be modified on login */
  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  /* Method which will be called upon clicking the log-in button */
  loginSubmit() {
    let not_empty = this.service.checkFilled(this.loginForm.value.username) && 
                this.service.checkFilled(this.loginForm.value.password);
    if (not_empty) {
      this.errorMsg = "";
      this.checkLogin();
    } else {
      this.errorMsg = "Username or password not filled in";
    }
  }

  /* Method responsible for verifying details with backend */
  // TODO use backend
  checkLogin() {
    console.log("login");
  }
}
