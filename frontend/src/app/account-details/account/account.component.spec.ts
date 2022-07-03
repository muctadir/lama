import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from 'app/classes/user';
import { AccountComponent } from './account.component';

/**
 * Tests for the account component
 */
describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  /**
   * Code that is executed before each test case
   * Initializes the test bed, and the component, and adds the dependencies
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test case which checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call getInformation() on initialization', () => {
    // Creates a spy which spies on getInformation
    let ngSpy = spyOn(component, "getInformation");
    // Calls ngOnInit
    component.ngOnInit();
    // Checks whether getInformation (spy) was called
    expect(ngSpy).toHaveBeenCalled();
  });


  it('should set the mode variable correctly', () => {
    // Creates a spy which spies on getInformation
    let modeSpy = spyOn(component, "getInformation");
    // Checks that the mode variable is orignally 0
    expect(component.mode).toBe(0);
    // Calls the function modeChange
    component.modeChange(1);
    // Checks whether mode variable is changed to 1
    expect(component.mode).toBe(1);
    // Checks whether getInformation was called succesfully
    expect(modeSpy).toHaveBeenCalled();
  });


  it('should call accountService.userData() when getting the user information', async () => {
    // Creates the spy on userData()
    let dataSpy = spyOn(component["accountService"], "userData");
    // Calls the getInfo function
    await component.getInformation();
    // Checks whether userData was called
    expect(dataSpy).toHaveBeenCalled();
  });


  it('should process the received information correctly', async () => {
    // Creates a dummy user
    let userReturn = new User(8, "Lannes");
    // Sets a variable of the user object
    userReturn.setEmail("marshal@france.fr");
    // Spies on the userData function and returns the dummy user
    let dataSpy = spyOn(component["accountService"], "userData").and.returnValue(Promise.resolve(userReturn));
    // Calls the getInformation function
    await component.getInformation();
    // Expects that the userData function was called
    expect(dataSpy).toHaveBeenCalled();
    // Checks whether the user variable was updated correctly
    expect(component.user.getId()).toBe(userReturn.getId());
    expect(component.user.getUsername()).toBe(userReturn.getUsername());
    expect(component.user.getEmail()).toBe(userReturn.getEmail());
  });


  it('should catch the error when getting user information', async () => {
    // Spies on userData and return error
    let dataSpy = spyOn(component["accountService"], "userData").and.throwError(new Error("error"));
    // Spies on the toastCommService in the catch statement
    let toastSpy = spyOn(component["toastCommService"], "emitChange");
    // Calls getInformation
    await component.getInformation();
    // Expects that the userData function was called
    expect(dataSpy).toHaveBeenCalled();
    // Expects that the ToastCommService was called
    expect(toastSpy).toHaveBeenCalled();
    // Checks the parameters with this ToastCommService was called
    expect(toastSpy).toHaveBeenCalledWith([false, "An error occured when requesting the server for user data."]);
  });

});
