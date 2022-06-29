import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from 'app/classes/user';
import { AccountInformationFormComponent } from './account-information-form.component';

/**
 * Tests cases for the account information form component
 */
describe('AccountInformationFormComponent', () => {
  let component: AccountInformationFormComponent;
  let fixture: ComponentFixture<AccountInformationFormComponent>;

  /**
   * Executed before every test, we added depencies for the user input forms
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountInformationFormComponent ],
      imports: [ReactiveFormsModule, FormsModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Simple test case to see whether component is created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Tests whether ngOnInit works correctly
  it('Tests whether ngOnInit works correctly', () => {
    // Creates a dummy user object
    let testUser = new User(8, "username_test");
    testUser.setEmail("test@test.com");
    testUser.setDesc("Test description");

    // Sets the user info
    component.userInfo = testUser;

    // Calls the ngOnInit function
    component.ngOnInit();

    // Checks whether the username is correct
    expect(component.username.value).toBe("username_test");
    // Checks whether the email is correct
    expect(component.email.value).toBe("test@test.com");
    // Checks whether the description is correct
    expect(component.description.value).toBe("Test description");
  });

  it('Tests whether ngOnInit works when conditions are not satisfied', () => {
    // Creates a dummy user object
    let testUser = new User(8, "");

    // Sets the user info
    component.userInfo = testUser;

    // Calls the ngOnInit function
    component.ngOnInit();

    // Checks whether the username is correct
    expect(component.username.value).toBe(null);
    // Checks whether the email is correct
    expect(component.email.value).toBe(null);
    // Checks whether the description is correct
    expect(component.description.value).toBe(null);
  });
});