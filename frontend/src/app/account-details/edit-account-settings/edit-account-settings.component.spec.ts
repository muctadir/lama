import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditAccountSettingsComponent } from './edit-account-settings.component';
import { User } from 'app/classes/user';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
    super(message);
    this.response = errortype;
  }
}

/**
 * Test suite for the Edit account settings component
 */
describe('EditAccountSettingsComponent', () => {
  let component: EditAccountSettingsComponent;
  let fixture: ComponentFixture<EditAccountSettingsComponent>;

  /**
   * Executed before each test case, adds dependencies for the forms and the router
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [ReactiveFormsModule],
      declarations: [EditAccountSettingsComponent],
      // Adds FormBuilder dependency
      providers: [FormBuilder]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Tests whether the component is created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    // Creates a dummy user object
    let testUser = new User(8, "username_test");
    testUser.setEmail("test@test.com");
    testUser.setDesc("Test description");
    // Sets the user info
    component.userAccount = testUser;
    // Calls the changes
    component.ngOnChanges();
    // Checks whether the username is correct
    expect(component.accountForm.value.username).toBe("username_test");
    // Checks whether the email is correct
    expect(component.accountForm.value.email).toBe("test@test.com");
    // Checks whether the description is correct
    expect(component.accountForm.value.description).toBe("Test description");
  });


  it('should change information with valid input', () => {
    // Creates a dummy user object
    let testUser = new User(8, "username_test");
    testUser.setEmail("test@test.com");
    testUser.setDesc("Test description");
    // Sets the user info
    component.userAccount = testUser;
    // Loads the user data into the form
    component.ngOnChanges();
    // Creates the spies for the function calls
    let spyCheck = spyOn(component, "checkInput").and.returnValue(true);
    let spyRequest = spyOn(component, "makeRequest");
    // Calls function
    component.changeInformation();
    // Checks results
    expect(spyCheck).toHaveBeenCalled();
    expect(spyRequest).toHaveBeenCalledWith({
      "id": 8,
      "username": "username_test",
      "description": "Test description",
      "email": "test@test.com"
    });
  });


  it('should not change information because of invalid input', () => {
    // Creates a dummy user object
    let testUser = new User(8, "username_test");
    // Sets the user info
    component.userAccount = testUser;
    // Creates the spies for the function calls
    let spyCheck = spyOn(component, "checkInput").and.returnValue(false);
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Calls the function
    component.changeInformation();
    // Checks results
    expect(spyCheck).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Please fill in all forms correctly!"]);
  });


  it('should check input for valid input', () => {
    // Creates a dummy user object
    let testUser = new User(8, "username_test");
    testUser.setEmail("test@test.com");
    testUser.setDesc("desc");
    // Sets the user info
    component.userAccount = testUser;
    // Loads the user data into the form
    component.ngOnChanges();
    // Calls the function
    let result = component.checkInput();
    // Checks the result
    expect(result).toBeTruthy();
  });


  it('should check input with empty username', () => {
    // Creates a dummy user object
    let testUser = new User(8, "");
    testUser.setEmail("test@test.com");
    testUser.setDesc("desc");
    // Sets the user info
    component.userAccount = testUser;
    // Loads the user data into the form
    component.ngOnChanges();
    // Calls the function
    let result = component.checkInput();
    // Checks the result
    expect(result).toBeFalsy();
  });

  it('should check input with empty email', () => {
    // Creates a dummy user object
    let testUser = new User(8, "testname");
    testUser.setEmail("");
    testUser.setDesc("desc");
    // Sets the user info
    component.userAccount = testUser;
    // Loads the user data into the form
    component.ngOnChanges();
    // Calls the function
    let result = component.checkInput();
    // Checks the result
    expect(result).toBeFalsy();
  });

  it('should check input with invalid email', () => {
    // Creates a dummy user object
    let testUser = new User(8, "testname");
    testUser.setEmail("xx");
    testUser.setDesc("desc");
    // Sets the user info
    component.userAccount = testUser;
    // Loads the user data into the form
    component.ngOnChanges();
    // Calls the function
    let result = component.checkInput();
    // Checks the result
    expect(result).toBeFalsy();
  });

  it('should make the request with valid input', async () => {
    // Creates dummy input
    let input = {
      "id": 5,
      "username": "testname",
      "description": "desctest",
      "email": "email@test.com"
    };

    // Creates the spies
    let spyRequest = spyOn(component["accountInfoService"], "changeAccountDetails");
    let spyEvent = spyOn(component.modeChangeEvent, 'emit');
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Makes the request
    await component.makeRequest(input);
    // Checks the calls
    expect(spyRequest).toHaveBeenCalledWith(input);
    expect(spyEvent).toHaveBeenCalledWith(0);
    expect(spyToast).toHaveBeenCalledWith([true, "Modification successful"]);
  });

  it('should make the request and catch an 511 error', async () => {
    // Creates dummy input
    let input = {
      "id": 5,
      "username": "",
      "description": "",
      "email": ""
    };

    // Creates dummy Error which is an AxiosError
    let dummyError = new TestError("bad error", { status: 511, data: "Input contains a forbidden character" });
    // Creates the spies
    let spyRequest = spyOn(component["accountInfoService"], "changeAccountDetails").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Makes the request
    await component.makeRequest(input);
    // Checks the calls
    expect(spyRequest).toHaveBeenCalledWith(input);
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains a forbidden character"]);
  });

  it('should make the request and catch an error', async () => {
    // Creates dummy input
    let input = {
      "id": 5,
      "username": "",
      "description": "",
      "email": ""
    };

    // Creates dummy Error which is an AxiosError
    let dummyError = new TestError("bad error", { status: 420, data: "Input contains leading or trailing whitespaces" });
    // Creates the spies
    let spyRequest = spyOn(component["accountInfoService"], "changeAccountDetails").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Makes the request
    await component.makeRequest(input);
    // Checks the calls
    expect(spyRequest).toHaveBeenCalledWith(input);
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains leading or trailing whitespaces"]);
  });

  it('should test the makeRequest function in case of error with taken email/name', async () => {
    // Creates dummy input
    let input = {
      "id": 5,
      "username": "",
      "description" : "",
      "email": ""
    };

    // Creates dummy Error which is an AxiosError
    let dummyError = new TestError("bad error", {status: 420, data: "Username or email taken"});
    // Creates the spies
    let spyRequest = spyOn(component["accountInfoService"], "changeAccountDetails").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Makes the request
    await component.makeRequest(input);
    // Checks the calls
    expect(spyRequest).toHaveBeenCalledWith(input);
    expect(spyToast).toHaveBeenCalledWith([false, "Username or email taken"]);
  });

  it('should make the request and catch an error', async () => {
    // Creates dummy input
    let input = {
      "id": 5,
      "username": "",
      "description": "",
      "email": ""
    };

    // Creates dummy Error which is an AxiosError
    let dummyError = new TestError("bad error", { status: 420, data: "Please enter valid details!" });
    // Creates the spies
    let spyRequest = spyOn(component["accountInfoService"], "changeAccountDetails").and.throwError(dummyError);
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Makes the request
    await component.makeRequest(input);
    // Checks the calls
    expect(spyRequest).toHaveBeenCalledWith(input);
    expect(spyToast).toHaveBeenCalledWith([false, "Please enter valid details!"]);
  });

});
