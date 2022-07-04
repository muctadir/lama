import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Project } from 'app/classes/project';
import { User } from 'app/classes/user';
import { HomePageComponent } from './home-page.component';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';

/**
 * Test suite for the home-page component
 */
describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  // Adds dependencies
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      imports: [RouterTestingModule],
      providers: [NgbActiveModal]
    })
      .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to see if the component is created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test to see if the ngOnInit function works correctly
  it('should call all functions on intialization', async () => {
    // Spy on the function that is called
    let spy = spyOn(component, "getProjects");

    // Creates a user
    let userReturn = new User(8, "Lannes");
    // Sets email of the user object
    userReturn.setEmail("marshal@france.fr");

    // Spies on the userData function and returns the user
    spyOn(component["accountService"], "userData").and.returnValue(Promise.resolve(userReturn));

    // Call the function
    await component.ngOnInit();

    // Check if the function works
    expect(spy).toHaveBeenCalled();
    // Checks whether the user variable was updated correctly
    expect(component.user.getId()).toBe(userReturn.getId());
    expect(component.user.getUsername()).toBe(userReturn.getUsername());
    expect(component.user.getEmail()).toBe(userReturn.getEmail());
  });

  // Test to see if the getProjects function works correctly
  it('should get all projects', async () => {
    // Create the project with constructor
    let projectNew = new Project(5, "testname", "testdesc");

    // Set other variables
    projectNew.setFrozen(true);
    projectNew.setNumberOfArtifacts(5);
    projectNew.setNumberOfCLArtifacts(4);

    // Spy on the function that is called
    let spy = spyOn(component['projectDataService'], "getProjects").and.returnValue(Promise.resolve([projectNew]));
    // Call the function
    await component.getProjects();
    // Check if the function works
    expect(spy).toHaveBeenCalled();
    // Does a deep comparison
    expect(component.projects).toEqual([projectNew]);
  });

  // Test if the openLogout function works correctly
  it('should drop session token, navigate to login page and display logout toast', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to true
    modalRef.componentInstance.confirmEvent = of(true);

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on sessionStorage.removeItem and stub the call
    let session_spy = spyOn(sessionStorage, 'removeItem');
    // Spy on route.navigate and stub the call
    let navigate_spy = spyOn(component['route'], 'navigate');
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Call the openLogout function
    component.openLogout();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    // Check if the session token was dropped
    expect(session_spy).toHaveBeenCalledWith('ses_token');
    // Check if the user is redirected to the login page
    expect(navigate_spy).toHaveBeenCalledWith(['/login'])
    // Check if toastCommService.emitChange is called with the correct parameters
    expect(toast_spy).toHaveBeenCalledWith([true, "Logged out successfully"]);
  })

  // Test if the openLogout does not do anything if confirm modal returns false
  it('should not do anything', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to true
    modalRef.componentInstance.confirmEvent = of(false);

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on sessionStorage.removeItem and stub the call
    let session_spy = spyOn(sessionStorage, 'removeItem');
    // Spy on route.navigate and stub the call
    let navigate_spy = spyOn(component['route'], 'navigate');
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Call the openLogout function
    component.openLogout();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    // Check that the session token was not dropped
    expect(session_spy).not.toHaveBeenCalled();
    // Check that the user is not redirected
    expect(navigate_spy).not.toHaveBeenCalled()
    // Check that toastCommService.emitChange is not called
    expect(toast_spy).not.toHaveBeenCalled()
  })
});