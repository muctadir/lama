// Jarl Jansen

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { InputCheckService } from 'app/services/input-check.service';
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

  // Checks the onRegister function using dummy form input 
  // (username: testusername and password: testpassword)
  // it('Checks the loginSubmit function using dummy form input', () => {
  //   // initializes the loginForm
  //   component.registerForm.value.username = "testusername";
  //   component.registerForm.value.email = "testemail@hotmail.com";
  //   component.registerForm.value.password = "testpassword";
  //   component.registerForm.value.description = "testdescription";

  //   // function call to test
  //   component.onRegister();
  //   expect(component.errorMsg).toBe("");
  // });

});
