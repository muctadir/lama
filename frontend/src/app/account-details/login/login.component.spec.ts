import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { InputCheckService } from 'app/services/input-check.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  /* Test environment setup */
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Added the dependencies InputCheckService, FormBuilder
      providers: [InputCheckService, FormBuilder]
    })
    .compileComponents();
  });

  /* Executed before each test case, creates a LoginComponent */
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* Test cases */
  // Checks whether the component gets created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checks default value of errorMsg is empty string
  it('Checks default value of errorMsg is empty string', () => {
    expect(component.errorMsg).toBe("");
  });

  // Checks whether loginSubmit function provides error
  // When called with unmodified forms
  it('Checks the loginSubmit function using no form input', () => {
    component.loginSubmit();
    expect(component.errorMsg).toBe("Username or password not filled in");
  });

  // Checks the loginSubmit function using dummy form input 
  // (username: testusername and password: testpassword)
  it('Checks the loginSubmit function using dummy form input', () => {
    // Initializes the loginForm
    component.loginForm.value.username = "testusername";
    component.loginForm.value.password = "testpassword";

    // Ensures that the checkLogin function is not called
    spyOn(component, 'checkLogin');

    // Calls the loginSubmit function
    component.loginSubmit();

    // Since loginForm is non-empty we expect error to be empty string
    expect(component.errorMsg).toBe("");
  });

});
