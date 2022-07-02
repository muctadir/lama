import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { ProjectSettingsComponent } from './project-settings.component';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AddUsersModalComponent } from 'app/modals/add-users-modal/add-users-modal.component';
import { User } from 'app/classes/user';

describe('ProjectSettingsComponent', () => {
  let component: ProjectSettingsComponent;
  let fixture: ComponentFixture<ProjectSettingsComponent>;

  // Instantiation of Router
  let router: Router;

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSettingsComponent],
      imports: [RouterTestingModule],
      providers: [FormBuilder, NgbActiveModal]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test if the open function works correctly when there are no other users in the project
  it('should open the add user modal and add the new user to the project', async () => {
    // Creates dummy input
    let dummyUser = new User(8, "something");
    // Instance of NgbModalRef
    modalRef = modalService.open(AddUsersModalComponent);
    // Set the value of componentInstance.addUserEvent to the dummy input
    modalRef.componentInstance.addUserEvent = of(dummyUser);
    // Set the value of projectMembers to the empty list
    component.projectMembers = [];

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on addMember and stub the call
    let member_spy = spyOn(component, 'addMember');

    // Call the open function
    component.open();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(AddUsersModalComponent);
    // Check that addMember is called with the right parameters
    expect(member_spy).toHaveBeenCalledWith(dummyUser, false);
  })

  // Test if the open function works correctly when the selected user is already in the project
  it('should open the add user modal and not call the addMember function', async () => {
    // Creates dummy input
    let dummyUser = new User(8, "something");
    // Instance of NgbModalRef
    modalRef = modalService.open(AddUsersModalComponent);
    // Set the value of componentInstance.addUserEvent to the dummy input
    modalRef.componentInstance.addUserEvent = of(dummyUser);
    // Set the value of projectMembers to a list containing dthe dummy input
    component.projectMembers = [dummyUser];

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on addMember and stub the call
    let member_spy = spyOn(component, 'addMember');

    // Call the open function
    component.open();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(AddUsersModalComponent);
    // Check that addMember is not called
    expect(member_spy).not.toHaveBeenCalled();
  })
});
