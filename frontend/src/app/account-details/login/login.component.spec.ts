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

});
