// Jarl Jansen

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { InputCheckService } from '../input-check.service';
import { AccountInformationFormComponent } from '../account-information-form/account-information-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  /* Test environment setup */
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  /* Sets up the testing environment */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent, AccountInformationFormComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
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

  /* Test cases */
  // Checks whether the component gets created
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Checks default value of errorMsg is empty string
  it('Checks default value of errorMsg is empty string', () => {
    expect(component.errorMsg).toBe("");
  });


  // Checks whether onRegister function provides error
  // When called with unmodified forms
  it('Checks the loginSubmit function using no form input', () => {
    component.onRegister();

    // Checks the error message
    expect(component.errorMsg).toBe("Fill in username, password and valid email.");
  });


  // Checks whether onRegister function provides error when 1 input in incorrect
  it('Checks whether onRegister function provides error when 1 input in incorrect', () => {
    // Sets the data in the FormControl
    component.username.setValue("testusername");
    component.email.setValue("test@test");
    component.password.setValue("testpassword123");
    component.passwordR.setValue("testpassword123");

    // Calls function
    component.onRegister();

    // Checks the error message
    expect(component.errorMsg).toBe("Fill in username, password and valid email.");
  });


  // Checks the loginSubmit function using modified form input
  it('Checks the loginSubmit function using modified form input', () => {
    // Sets the data in the FormControl
    component.username.setValue("testusername");
    component.email.setValue("test@test.com");
    component.password.setValue("testpassword123");
    component.passwordR.setValue("testpassword123");
    component.desc.setValue("test description");

    // Ensures that the register function is not called
    spyOn(component, 'register');

    // Calls function
    component.onRegister();

    // Checks that the errorMsg is an empty string
    expect(component.errorMsg).toBe("");
  });

});
