import { Component} from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /* String, when login data is incorrect will contain error */
  errorMsg = "";

  /* Constructor which gets the formBuilder from Angular forms */
  constructor(private formBuilder: FormBuilder) { }

  /* Login form, data will be modified on login */
  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  /* Method which will be called upon clicking the log-in button */
  loginSubmit() {
    // Check whether input is non-empty
    let non_empty: boolean = this.checkInput(this.loginForm.value.username, this.loginForm.value.password);
    // If input in non-empty try to log-in
    if (non_empty) {
      this.checkLogin();
    }
  }

  /* Method responsible for checking whether the input username and password are filled in */
  checkInput(username: string, password: string) {
    // username or password missing, display error msg, return false
    if(!username || !password){
      this.errorMsg = "Username or password not filled in";
      return false;
    // username and password filled in, return true
    } else {
      this.errorMsg = "";
      return true;
    } 
  }

  /* Method responsible for verifying details with backend */
  // TODO use backend
  checkLogin() {
    console.log("login");
  }
}
