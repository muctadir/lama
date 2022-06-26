import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from 'app/classes/user';
import { AxiosError } from 'axios';
import { AccountChangePasswordComponent } from './account-change-password.component';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

// Class used to create custom AxiosErrors
export class TestAxiosError extends AxiosError {
  override response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

/**
 * Test procedure for the Account-Change-Password-Component
 */
describe('AccountChangePasswordComponent', () => {
  let component: AccountChangePasswordComponent;
  let fixture: ComponentFixture<AccountChangePasswordComponent>;

  /**
   * Executed before every test case
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountChangePasswordComponent ],
      // Adds dependencies
      imports: [ReactiveFormsModule, FormsModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component gets created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Checks whether editPasswordF, stubbing all, valid input case', () => {
    // Creates a dummy user account
    component.userAccount = new User(5, "new_username");
    // Sets the passwordForm with dummy values
    component.passwordForm.controls['old_password'].setValue("old_passw");
    component.passwordForm.controls['new_password'].setValue("new_passw");
    // Makes a spy for the checkInput function, and returns true
    let spyValid = spyOn(component, "checkInput").and.returnValue(true);
    // Makes a spy for the makeRequest function
    let spyRequest = spyOn(component, "makeRequest");

    // Calls editPasswordF
    component.editPasswordF();

    // Checks whether the functions have been called, and parameters are correct
    expect(spyValid).toHaveBeenCalled();
    expect(spyRequest).toHaveBeenCalled();
    expect(spyRequest).toHaveBeenCalledWith({"id": 5, "password" : "old_passw", "newPassword": "new_passw"});
  });


  it('Checks whether editPasswordF, stubbing all, valid input case', () => {
    // Creates a dummy user account
    component.userAccount = new User(5, "new_username");

    // Case where input is incorrect
    let spyValid = spyOn(component, "checkInput").and.returnValue(false);
    // Makes a spy for the makeRequest function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls editPasswordF
    component.editPasswordF();

    // Checks whether the functions have been called, and parameters are correct
    expect(spyValid).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Please fill in all forms correctly!"]);
  });


  it('CheckInput for valid inputs, if superadmin = true and superadmin is false', () => {
    // Sets value for superadmin
    component.superAdmin = true;
    // Sets the passwordForm with dummy values
    component.passwordForm.controls['old_password'].setValue("old_passw");
    component.passwordForm.controls['new_password'].setValue("new_passw");
    component.passwordForm.controls['new_passwordR'].setValue("new_passw");

    // Calls checkInput function
    let result = component.checkInput();

    // Return value should be true
    expect(result).toBeTruthy();

    // Sets value for superadmin
    component.superAdmin = false;

    // Calls checkInput function
    result = component.checkInput();

    // Return value should be true
    expect(result).toBeTruthy();
  });


  it('CheckInput for valid input only if user is superadmin', () => {
    // Sets value for superadmin
    component.superAdmin = true;
    // Sets the passwordForm with dummy values
    component.passwordForm.controls['old_password'].setValue("");
    component.passwordForm.controls['new_password'].setValue("new_passw");
    component.passwordForm.controls['new_passwordR'].setValue("new_passw");

    // Calls checkInput function
    let result = component.checkInput();

    // Return value should be true
    expect(result).toBeTruthy();

    // Sets value for superadmin
    component.superAdmin = false;

    // Calls checkInput function
    result = component.checkInput();

    // Return value should be false
    expect(result).toBeFalsy();
  });


  it('CheckInput for invalid input', () => {
    // Sets value for superadmin
    component.superAdmin = true;
    // Sets the passwordForm with dummy values
    component.passwordForm.controls['old_password'].setValue("");
    component.passwordForm.controls['new_password'].setValue("");
    component.passwordForm.controls['new_passwordR'].setValue("");

    // Calls checkInput function
    let result = component.checkInput();

    // Return value should be false
    expect(result).toBeFalsy();

    // Sets the passwordForm with dummy values
    component.passwordForm.controls['old_password'].setValue("");
    component.passwordForm.controls['new_password'].setValue("a");
    component.passwordForm.controls['new_passwordR'].setValue("ab");

    // Calls checkInput function
    result = component.checkInput();

    // Return value should be false
    expect(result).toBeFalsy();
  });


  it('Checks the makeRequest function when it throws no error', async () => {
    // Makes dummy input
    let input = {"id": 5, "password" : "old_passw", "newPassword": "new_passw"};

    // Creates the spies for the different function calls
    let spyR = spyOn(component["accountInfoService"], "changePassword");
    let spyEvent = spyOn(component.modeChangeEvent, 'emit');
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the makeRequest function with the dummy input
    await component.makeRequest(input);

    // Checks whether the backend call was made with the correct parameters
    expect(spyR).toHaveBeenCalledWith({"id": 5, "password" : "old_passw", "newPassword": "new_passw"});
    // Checks whether an event was emitted
    expect(spyEvent).toHaveBeenCalledWith(0);
    // Checks whether a toast was shown
    expect(spyToast).toHaveBeenCalledWith([true, "Password changed"]);
  });


  it('Checks the makeRequest function when it throws an error with status 511', async () => {
    // Makes dummy input
    let input = {"id": 5, "password" : "old_passw", "newPassword": "new_passw"};

    // Creates dummyError 
    let dummyError = new TestError("bad error", {status: 511})

    // Creates the spies for the different function calls
    let spyR = spyOn(component["accountInfoService"], "changePassword").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the makeRequest function with the dummy input
    await component.makeRequest(input);

    // Checks whether the backend call was made with the correct parameters
    expect(spyR).toHaveBeenCalledWith({"id": 5, "password" : "old_passw", "newPassword": "new_passw"});
    // Checks whether a toast was shown
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains a forbidden character: \\ ; , or #"]);
  });


  it('Checks the makeRequest function when it throws an error with status != 511', async () => {
    // Makes dummy input
    let input = {"id": 5, "password" : "old_passw", "newPassword": "new_passw"};

    // Creates dummyError 
    let dummyError = new TestError("bad error", {status: 420})

    // Creates the spies for the different function calls
    let spyR = spyOn(component["accountInfoService"], "changePassword").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the makeRequest function with the dummy input
    await component.makeRequest(input);

    // Checks whether the backend call was made with the correct parameters
    expect(spyR).toHaveBeenCalledWith({"id": 5, "password" : "old_passw", "newPassword": "new_passw"});
    // Checks whether a toast was shown
    expect(spyToast).toHaveBeenCalledWith([false, "An unknown error occurred"]);
  });


  it('Checks the makeRequest function when it throws an AxiosError with status != 511', async () => {
    // Makes dummy input
    let input = {"id": 5, "password" : "old_passw", "newPassword": "new_passw"};

    // Creates dummy Error which is an AxiosError
    let dummyError = new TestAxiosError("bad error", {status: 420, data: "some_error_message"})

    // Creates the spies for the different function calls
    let spyR = spyOn(component["accountInfoService"], "changePassword").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the makeRequest function with the dummy input
    await component.makeRequest(input);

    // Checks whether the backend call was made with the correct parameters
    expect(spyR).toHaveBeenCalledWith({"id": 5, "password" : "old_passw", "newPassword": "new_passw"});
    // Checks whether a toast was shown
    expect(spyToast).toHaveBeenCalledWith([false, "some_error_message"]);
  });
});
