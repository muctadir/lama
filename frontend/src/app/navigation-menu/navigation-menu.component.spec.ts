import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavigationMenuComponent } from './navigation-menu.component';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';

/**
 * Test suite for the navigation menu
 */
describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;
  let router: Router;
  
  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationMenuComponent],
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule],
      providers: [NgbActiveModal]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Checks ngOnInit', () => {
    // Spies on this.router.url
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/5/stats');
    // Spy on evalURL function
    let spy = spyOn(component, "evalURL");

    // Calls ngOnInit
    component.ngOnInit();

    // Checks whether evalURL was called correctly
    expect(spy).toHaveBeenCalledWith("/project/5/stats");
  });

  // Test whether changeSize works correctly
  it('Test whether changeSize works correctly', () => {
    expect(component.collapsed).toBeTruthy();
    component.changeSize();
    expect(component.collapsed).toBeFalsy();
  });

  // Test the changePage function
  it('Tests the changePage function', () => {
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/5/stats');

    // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');

    // Calls the changePage function
    component.changePage("thememanagement");

    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', '5', 'thememanagement']);
  });

  it('case 1 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("stats");
    // Check new state
    expect(component.page).toBe(0);
  });

  it('case 2 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("labelling");
    // Check new state
    expect(component.page).toBe(1);
  });

  it('case 3 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("artifact");
    // Check new state
    expect(component.page).toBe(2);
  });

  it('case 4 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("label");
    // Check new state
    expect(component.page).toBe(3);
  });

  it('case 5 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("theme");
    // Check new state
    expect(component.page).toBe(4);
  });

  it('case 6 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("conflict");
    // Check new state
    expect(component.page).toBe(5);
  });

  it('case 7 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("settings");
    // Check new state
    expect(component.page).toBe(6);
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
  let navigate_spy = spyOn(component['router'], 'navigate');
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
  let navigate_spy = spyOn(component['router'], 'navigate');
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
