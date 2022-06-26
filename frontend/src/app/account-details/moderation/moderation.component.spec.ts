import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'app/classes/user';
import { ModerationComponent } from './moderation.component';

/**
 * Test case for Moderation Component
 */
describe('ModerationComponent', () => {
  let component: ModerationComponent;
  let fixture: ComponentFixture<ModerationComponent>;

  /**
   * Executed for every test case
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModerationComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test case checking whether the component gets created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('tests the ngOnInit function', async () => {
    // Creates the spy for the getAllUsers
    let spy = spyOn(component, "getAllUsers");

    // Calls the ngOnInit function
    await component.ngOnInit();

    // Checks whether the function was called
    expect(spy).toHaveBeenCalled();
  });

  it('test modeChange, its function calls and the modification', async () => {
    // Checks the original value of mode variable
    expect(component.mode).toBe(0);

    // Makes the spy for the getAllUsers call
    let spy = spyOn(component, "getAllUsers");

    // Calls the function and waits 
    await component.modeChange(2);

    // Checks whether the value changed properly
    expect(component.mode).toBe(2);
    // Checks whether the getAllUsers function was called
    expect(spy).toHaveBeenCalled();
  });

  it('getAllUsers function without an error', async () => {
    // Creates the dummy data
    let result = [new User(2, "user1"), new User(4, "user2")];

    // Spies on the backend call and returns the dummy data
    let spy = spyOn(component["accountService"], "allUsersData").and.returnValue(Promise.resolve(result));

    // Calls the function and waits
    await component.getAllUsers();

    // Checks whether the backend call was made
    expect(spy).toHaveBeenCalled();
    // Checks whether the users data is modified correctly
    expect(component.users).toBe(result);
  });

  it('getAllUsers function with an error', async () => {
    // Spies on the backend call and returns an error
    let spy = spyOn(component["accountService"], "allUsersData").and.throwError(new Error("something"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function and waits
    await component.getAllUsers();

    // Checks whether the backend call was made
    expect(spy).toHaveBeenCalled();
    // Checks whether the users data is modified correctly
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when gathering data from the server"]);
  });

  it('tests edit user', () => {
    // Checks initial value
    expect(component.mode).toBe(0);

    // Creates dummy input
    let dummyUser = new User(8, "something");

    // Calls function with dummy input
    component.editUser(dummyUser);

    // Checks whether user is now dummy input
    expect(component.user).toBe(dummyUser);
    // Checks that the mode is now 1
    expect(component.mode).toBe(1);
  });

});
