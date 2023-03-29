import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'app/classes/user';
import { UserApprovalComponent } from './user-approval.component';

describe('UserApprovalComponent', () => {
  let component: UserApprovalComponent;
  let fixture: ComponentFixture<UserApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserApprovalComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', async () => {
    // Creates the spy for the getAllUsers
    let spy = spyOn(component, "getPendingUsers");
    // Calls the ngOnInit function
    await component.ngOnInit();
    // Checks whether the function was called
    expect(spy).toHaveBeenCalled();
  });

  it('should get all pending users', async () => {
    // Creates the dummy data
    let result = [new User(2, "user1"), new User(4, "user2")];
    // Spies on the backend call and returns the dummy data
    let spy = spyOn(component["accountService"], "pendingUsersData").and.returnValue(Promise.resolve(result));
    // Calls the function and waits
    await component.getPendingUsers();
    // Checks whether the backend call was made
    expect(spy).toHaveBeenCalled();
    // Checks whether the users data is modified correctly
    expect(component.users).toBe(result);
  });

  it('should throw an error while getting all pending users', async () => {
    // Spies on the backend call and returns an error
    let spy = spyOn(component["accountService"], "pendingUsersData").and.throwError(new Error("something"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Calls the function and waits
    await component.getPendingUsers();
    // Checks whether the backend call was made
    expect(spy).toHaveBeenCalled();
    // Checks whether the users data is modified correctly
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when gathering data from the server"]);
  });

});
