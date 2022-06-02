import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

import { FormBuilder } from '@angular/forms';
import { InputCheckService } from '../input-check.service';

describe('RegisterComponent', () => {
  /* Test environment setup */
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Added the dependencies InputCheckService, FormBuilder
      declarations: [ RegisterComponent ],
      providers: [InputCheckService, FormBuilder]
    })
    .compileComponents();
  });

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
    expect(component.errorMsg).toBe("Invalid username, password or email.");
  });

  // Checks the onRegister function using dummy form input 
  // (username: testusername and password: testpassword)
  it('Checks the loginSubmit function using dummy form input', () => {
    // initializes the loginForm
    component.registerForm.value.username = "testusername";
    component.registerForm.value.email = "testemail@hotmail.com";
    component.registerForm.value.password = "testpassword";
    component.registerForm.value.description = "testdescription";

    // function call to test
    component.onRegister();
    expect(component.errorMsg).toBe("");
  });

});
