// Jarl Jansen

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { InputCheckService } from 'app/services/input-check.service';
import { AccountInformationFormComponent } from '../account-information-form/account-information-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

/**
 * Test suite for the Register component
 */
describe('RegisterComponent', () => {
  /* Test environment setup */
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  /* Sets up the testing environment */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent, AccountInformationFormComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
      // Added the dependencies InputCheckService
      providers: [InputCheckService]
    })
    .compileComponents();
  });

  /* Executed before each test case, creates a RegisterComponent */
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component gets created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Tests onRegister with valid input', () => {
    // Sets the values for the different forms
    component.username.setValue("testusername");
    component.email.setValue("test@test.com");
    component.password.setValue("testpassword");
    component.passwordR.setValue("testpassword");
    component.desc.setValue("test description");
    // Creates spy on the register() function call
    let spy = spyOn(component, "register");
    // Calls function to be tested
    component.onRegister();
    // Checks whether register was called
    expect(spy).toHaveBeenCalled();
  });

  it('Tests onRegister with an empty input', () => {
    // Sets the values for the different forms
    component.username.setValue("");
    component.email.setValue("test@test.com");
    component.password.setValue("testpassword");
    component.passwordR.setValue("testpassword");
    component.desc.setValue("test description");
    // Creates spy on the toast
    let spy = spyOn(component["toastCommService"], "emitChange");
    // Calls function to be tested
    component.onRegister();
    // Checks whether toast was created
    expect(spy).toHaveBeenCalledWith([false, "Please enter input in all input fields"]);
  });

  it('Tests onRegister with a bad email', () => {
    // Sets the values for the different forms
    component.username.setValue("testusername");
    component.email.setValue("test");
    component.password.setValue("testpassword");
    component.passwordR.setValue("testpassword");
    component.desc.setValue("test description");
    // Creates spy on the toast
    let spy = spyOn(component["toastCommService"], "emitChange");
    // Calls function to be tested
    component.onRegister();
    // Checks whether toast was created
    expect(spy).toHaveBeenCalledWith([false, "Please enter a valid email address"]);
  });

  it('Checks register for valid input', async () => {
    // Sets the values for the different forms
    component.username.setValue("testusername");
    component.email.setValue("test@test.com");
    component.password.setValue("testpassword");
    component.passwordR.setValue("testpassword");
    component.desc.setValue("test description");
    // Creates spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Creates a spy for the accountInfoService backend call
    let spy = spyOn(component["accountInfoService"], "registerUser");
    // Creates spy for the router
    let spyRouter = spyOn(component["route"], "navigate");
    // Calls function to be tested
    await component.register();
    // Input
    let input = {
      username: "testusername",
      email: "test@test.com",
      description: "test description",
      password: "testpassword",
      passwordR: "testpassword",
    }
    // Checks whether register was called
    expect(spy).toHaveBeenCalledWith(input);
    // Checks toast emitted
    expect(spyToast).toHaveBeenCalledWith([true, "Account created successfully!"]);
    // Checks router call
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
  });

  it('Checks register for valid input', async () => {
    // Sets the values for the different forms
    component.username.setValue("testusername");
    component.email.setValue("test@test.com");
    component.password.setValue("testpassword");
    component.passwordR.setValue("testpassword");
    component.desc.setValue("test description");
    // Creates spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Creates a spy for the accountInfoService backend call, and returns an error
    let spy = spyOn(component["accountInfoService"], "registerUser")
      .and.throwError(new TestError("message", {data: "some error"}));
    // Calls function to be tested
    await component.register();
    // Input
    let input = {
      username: "testusername",
      email: "test@test.com",
      description: "test description",
      password: "testpassword",
      passwordR: "testpassword",
    }
    // Checks whether register was called
    expect(spy).toHaveBeenCalledWith(input);
    // Checks toast emitted
    expect(spyToast).toHaveBeenCalledWith([false, "some error"]);
  });
});
