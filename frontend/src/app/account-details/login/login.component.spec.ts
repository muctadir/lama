import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCheckService } from 'app/services/input-check.service';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Test suite for the Login component
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
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

  // Checks whether the component gets created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Checks loginSubmit with valid input', () => {
    // Sets a valid input
    component.loginForm.setValue({username: 'username_test', password: 'password_test'});
    // Creates the spy for checklogin
    let spy = spyOn(component, "checkLogin");
    // Calls the function to be tested
    component.loginSubmit();
    // Checks results
    expect(component.loginForm.value.username).toBe("username_test");
    expect(component.loginForm.value.password).toBe("password_test");
    expect(spy).toHaveBeenCalled();
  });

  it('Checks loginSubmit with invalid username', () => {
    // Sets a valid input
    component.loginForm.setValue({username: '', password: 'password_test'});
    // Creates spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Calls the function to be tested
    component.loginSubmit();
    // Checks the results
    expect(component.loginForm.value.username).toBe("");
    expect(component.loginForm.value.password).toBe("password_test");
    expect(spyToast).toHaveBeenCalledWith([false, 'Please fill in a username and password'])
  });

  it('Checks loginSubmit with invalid password', () => {
    // Sets a valid input
    component.loginForm.setValue({username: 'yayaya', password: ''});
    // Creates spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Calls the function to be tested
    component.loginSubmit();
    // Checks the results
    expect(component.loginForm.value.username).toBe("yayaya");
    expect(component.loginForm.value.password).toBe("");
    expect(spyToast).toHaveBeenCalledWith([false, 'Please fill in a username and password'])
  });
});