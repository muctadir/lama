import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'app/classes/user';
import { ModerationComponent } from './moderation.component';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';
import { of } from 'rxjs';

/**
 * Test case for Moderation Component
 */
describe('ModerationComponent', () => {
  let component: ModerationComponent;
  let fixture: ComponentFixture<ModerationComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  /**
   * Executed for every test case
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModerationComponent ],
      imports: [RouterTestingModule],
      providers: [NgbActiveModal]
    })
    .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
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

  it('should initialize correctly', async () => {
    // Creates the spy for the getAllUsers
    let spy = spyOn(component, "getAllUsers");
    // Calls the ngOnInit function
    await component.ngOnInit();
    // Checks whether the function was called
    expect(spy).toHaveBeenCalled();
  });

  it('should get all users when the mode is changed', async () => {
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

  it('should get all users', async () => {
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

  it('should throw an error while getting all users', async () => {
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

  it('should edit a user', () => {
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

  // Test if the softDelete function works correctly
  it('should open the artifact upload modal and display success toast', async () => {
    // Creates dummy input
    let dummyUser = new User(8, "something");
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to true
    modalRef.componentInstance.confirmEvent = of(true);

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')
    // Spy on accountService.softDelUser and stub the call
    let delete_spy = spyOn(component['accountService'], 'softDelUser')
    // Spy on getAllUsers and stub the call
    let users_spy = spyOn(component, 'getAllUsers')

    // Call the softDelete function
    await component.softDelete(dummyUser);
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    // Check if accountService.softDelUser is called with the correct parameters
    expect(delete_spy).toHaveBeenCalledWith(dummyUser);
    // Check if toastCommService.emitChange is called with the correct parameters
    expect(toast_spy).toHaveBeenCalledWith([true, "User deleted successfully"]);
    // Check if getAllUsers is called
    expect(users_spy).toHaveBeenCalled();
  })

  // Test if the softDelete function displays the error modal when needed
  it('should open the artifact upload modal and display failure toast', async () => {
    // Creates dummy input
    let dummyUser = new User(8, "something");
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to true
    modalRef.componentInstance.confirmEvent = of(true);

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')
    // Spy on accountService.softDelUser and return an error
    let delete_spy = spyOn(component['accountService'], 'softDelUser').and.throwError("Test error");
    // Spy on getAllUsers and stub the call
    let users_spy = spyOn(component, 'getAllUsers')

    // Call the softDelete function
    await component.softDelete(dummyUser);
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    // Check if accountService.softDelUser is called with the correct parameters
    expect(delete_spy).toHaveBeenCalledWith(dummyUser);
    // Check if toastCommService.emitChange is called with the correct parameters
    expect(toast_spy).toHaveBeenCalledWith([false, "Something went wrong"]);
    // Check if getAllUsers is not called
    expect(users_spy).not.toHaveBeenCalled();
  });

  // Test if the softDelete function doesn't delete users if confirm modal returns false
  it('should open the artifact upload modal and not delete user or display toasts', async () => {
    // Creates dummy input
    let dummyUser = new User(8, "something");
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(false);

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')
    // Spy on accountService.softDelUser and stub the call
    let delete_spy = spyOn(component['accountService'], 'softDelUser');

    // Call the softDelete function
    await component.softDelete(dummyUser);
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    // Check that accountService.softDelUser is not called
    expect(delete_spy).not.toHaveBeenCalled();
    // Check that no toasts were called with the correct parameters
    expect(toast_spy).not.toHaveBeenCalled();
  });

});
