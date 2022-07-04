import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/classes/user';
import { ProjectCreationComponent } from './project-creation.component';
import { of } from 'rxjs';
import { AddUsersModalComponent } from 'app/modals/add-users-modal/add-users-modal.component';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
    super(message);
    this.response = errortype;
  }
}

/**
 * Test suite for the project creation component
 */
describe('ProjectCreationComponent', () => {
  let component: ProjectCreationComponent;
  let fixture: ComponentFixture<ProjectCreationComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCreationComponent],
      // Adds RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule],
      // Adds NgbActiveModal and FormBuilder dependencies
      providers: [NgbActiveModal, FormBuilder]
    })
      .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call all functions on initialization', () => {
    // Creates the spy
    let spy = spyOn(component, "getUsers");

    // Calls ngOnInit
    component.ngOnInit();

    // Checks whether function was called
    expect(spy).toHaveBeenCalled();
  });

  it('should get all users', async () => {
    // Dummy input
    let result = [new User(3, "name1"), new User(8, "name2")];

    // Creates the spy
    let spy = spyOn(component["projectDataService"], "getUsers").and.returnValue(Promise.resolve(result));

    // Calls ngOnInit
    await component.getUsers();

    // Checks whether function was called
    expect(spy).toHaveBeenCalled();
    // Check values
    expect(component.allMembers).toBe(result);
  });

  it('should create a project', async () => {
    // Sets a valid input
    let formBuilder = new FormBuilder();
    let projectForm = formBuilder.group({
      projectName: 'testname',
      projectDesc: 'testdesc',
      labellerCount: 2,
      // Array containing the different label types
      labeltypes: formBuilder.array([])
    });

    // Sets the dummy input as the projectForm in the component
    component.projectForm = projectForm;

    // Spies on addUser function and does dummy input for it
    let addUsersSpy = spyOn(component, "addUsers").and.callFake(param => {
      param["users"] = [];
      param["users"].push({ "u_id": 1, "admin": true });
      param["users"].push({ "u_id": 2, "admin": false });
    });

    // Spies on labelTypeToArray function and provides dummy return values
    let addLabelSpy = spyOn(component, "labelTypeToArray").and.returnValue(["label1", "label2"]);
    // Spies on checkProjectData function and returns true
    let checkSpy = spyOn(component, "checkProjectData").and.returnValue(true);
    // Spies on makeRequest function
    let requestSpy = spyOn(component["projectDataService"], "makeRequest");
    // Spies on the toast emit function
    let toastSpy = spyOn(component["toastCommService"], "emitChange");
    // Spies on the router
    let routerSpy = spyOn(component["router"], "navigate");

    // Calls the function to be tested
    await component.createProject()

    // Simple checks
    expect(addUsersSpy).toHaveBeenCalled();
    expect(addLabelSpy).toHaveBeenCalled();

    // More complex dummy object used for testing
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "testname",
      "description": "testdesc",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 1, "admin": true });
    example2["users"].push({ "u_id": 2, "admin": false });
    example2["labelTypes"] = ["label1", "label2"];

    // Tests checking whether execution is correct
    expect(checkSpy).toHaveBeenCalledWith(example2);
    expect(requestSpy).toHaveBeenCalledOnceWith(example2);
    expect(toastSpy).toHaveBeenCalledWith([true, "Project created sucessfully"]);
    expect(routerSpy).toHaveBeenCalledWith(["/home"]);
  });

  it('should catch error for incalid input', async () => {
    // Spies on addUsers
    let addUsersSpy = spyOn(component, "addUsers")
    // Spies on labelTypeToArray function
    let addLabelSpy = spyOn(component, "labelTypeToArray");
    // Spies on checkProjectData function and returns true
    let checkSpy = spyOn(component, "checkProjectData").and.returnValue(false);
    // Spies on the toast emit function
    let toastSpy = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.createProject()

    // Simple checks
    expect(addUsersSpy).toHaveBeenCalled();
    expect(addLabelSpy).toHaveBeenCalled();

    // Tests checking whether execution is correct
    expect(checkSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith([false, "Please fill in all input fields!"]);
  });

  it('should catch error 511', async () => {
    // Spies on addUsers
    let addUsersSpy = spyOn(component, "addUsers")
    // Spies on labelTypeToArray function
    let addLabelSpy = spyOn(component, "labelTypeToArray");
    // Spies on checkProjectData function and returns true
    let checkSpy = spyOn(component, "checkProjectData").and.returnValue(true);
    // Spies on makeRequest function
    let requestSpy = spyOn(component["projectDataService"], "makeRequest").and.throwError(new TestError("msg", { data: "Input contains a forbidden character" }));
    // Spies on the toast emit function
    let toastSpy = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.createProject()

    // Simple checks
    expect(addUsersSpy).toHaveBeenCalled();
    expect(addLabelSpy).toHaveBeenCalled();
    expect(checkSpy).toHaveBeenCalled();
    expect(requestSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith([false, "Input contains a forbidden character"]);
  });

  it('should catch error for invalid input', async () => {
    // Spies on addUsers
    let addUsersSpy = spyOn(component, "addUsers")
    // Spies on labelTypeToArray function
    let addLabelSpy = spyOn(component, "labelTypeToArray");
    // Spies on checkProjectData function and returns true
    let checkSpy = spyOn(component, "checkProjectData").and.returnValue(true);
    // Spies on makeRequest function
    let requestSpy = spyOn(component["projectDataService"], "makeRequest")
      .and.throwError(new TestError("msg", { data: "Input contains leading or trailing whitespaces" }));
    // Spies on the toast emit function
    let toastSpy = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.createProject()

    // Simple checks
    expect(addUsersSpy).toHaveBeenCalled();
    expect(addLabelSpy).toHaveBeenCalled();
    expect(checkSpy).toHaveBeenCalled();
    expect(requestSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith([false, "Input contains leading or trailing whitespaces"]);
  });


  it('should catch creation error', async () => {
    // Spies on addUsers
    let addUsersSpy = spyOn(component, "addUsers")
    // Spies on labelTypeToArray function
    let addLabelSpy = spyOn(component, "labelTypeToArray");
    // Spies on checkProjectData function and returns true
    let checkSpy = spyOn(component, "checkProjectData").and.returnValue(true);
    // Spies on makeRequest function
    let requestSpy = spyOn(component["projectDataService"], "makeRequest")
      .and.throwError(new TestError("msg", { data: "An error occured while creating the theme" }));
    // Spies on the toast emit function
    let toastSpy = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.createProject()

    // Simple checks
    expect(addUsersSpy).toHaveBeenCalled();
    expect(addLabelSpy).toHaveBeenCalled();
    expect(checkSpy).toHaveBeenCalled();
    expect(requestSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith([false, "An error occured while creating the theme"]);
  });


  it('should check the project input', () => {
    // More complex dummy object used for testing
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "testname",
      "description": "testdesc",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 1, "admin": true });
    example2["users"].push({ "u_id": 2, "admin": false });
    example2["labelTypes"] = ["label1", "label2"];

    // Calls the function to be tested
    let result = component.checkProjectData(example2);

    // Checks result
    expect(result).toBeTruthy();
  });


  it('should catch invalid name', () => {
    // More complex dummy object used for testing
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "",
      "description": "testdesc",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 1, "admin": true });
    example2["users"].push({ "u_id": 2, "admin": false });
    example2["labelTypes"] = ["label1", "label2"];

    // Calls the function to be tested
    let result = component.checkProjectData(example2);

    // Checks result
    expect(result).toBeFalsy();
  });

  it('should catch invalid description', () => {
    // More complex dummy object used for testing
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "something",
      "description": "",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 1, "admin": true });
    example2["users"].push({ "u_id": 2, "admin": false });
    example2["labelTypes"] = ["label1", "label2"];

    // Calls the function to be tested
    let result = component.checkProjectData(example2);

    // Checks result
    expect(result).toBeFalsy();
  });

  it('should catch zero labels given', () => {
    // More complex dummy object used for testing
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "something",
      "description": "tester",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 1, "admin": true });
    example2["users"].push({ "u_id": 2, "admin": false });
    example2["labelTypes"] = [];

    // Calls the function to be tested
    let result = component.checkProjectData(example2);

    // Checks result
    expect(result).toBeFalsy();
  });

  it('should catch empty labels', () => {
    // More complex dummy object used for testing
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "something",
      "description": "tester",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 1, "admin": true });
    example2["users"].push({ "u_id": 2, "admin": false });
    example2["labelTypes"] = ["test", ""];

    // Calls the function to be tested
    let result = component.checkProjectData(example2);

    // Checks result
    expect(result).toBeFalsy();
  });

  it('should add users', () => {
    // Makes dummy input
    let example1: Record<string, any> = {};
    example1["project"] = {
      "name": "something",
      "description": "tester",
      "criteria": 2
    };

    // Spies on document getElementById
    // @ts-ignore: type
    spyOn(document, "getElementById").and.returnValue({ checked: true })

    // adds user to the component
    component.projectMembers = [new User(5, "karl")];

    // Calls the function to be tested
    component.addUsers(example1);

    // More complex dummy object used for testing result
    let example2: Record<string, any> = {};
    example2["project"] = {
      "name": "something",
      "description": "tester",
      "criteria": 2
    };
    example2["users"] = [];
    example2["users"].push({ "u_id": 5, "admin": true });

    // Checks result
    expect(example1).toEqual(example2);
  });

  it('should add label types', () => {
    // Creates the spy
    let spy = spyOn(component.labeltypes, "push");

    // Calls the function to be tested
    component.addLabelType();

    // Checks whether the spy was called correctly
    expect(spy).toHaveBeenCalled();
  });


  it('should delete label type', () => {
    // Creates the spy
    let spy = spyOn(component.labeltypes, "removeAt");

    // Calls the function to be tested
    component.deleteLabelType(5);

    // Checks whether the spy was called correctly
    expect(spy).toHaveBeenCalled();
  });

  it('should remove a member', () => {
    let u1 = new User(1, "aaa");
    let u2 = new User(2, "bbb");
    let u3 = new User(3, "ccc");

    // Creates dummy data for allMembers array
    let userArray = [u1, u2, u3];
    component.projectMembers = userArray;

    // Calls the function to be tested
    component.removeMember(u2);

    // Checks whether the spy was called correctly
    expect(component.projectMembers).toEqual([u1, u3]);
  });

  it('should convert label type to array', () => {
    // Creates a spy
    let spy = spyOn(component["projectForm"].value.labeltypes, "values").and.returnValue([{"label": "a"}, {"label": "b"}]);

    // Calls the function to be tested
    let result = component.labelTypeToArray();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(["a", "b"]);
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
    // Set the value of allMembers to a list containing just the dummy input
    component.allMembers = [dummyUser];

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)

    // Call the open function
    component.open();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(AddUsersModalComponent);
    // Check that the dummy user was added to projectMembers
    expect(component.projectMembers).toEqual([dummyUser]);
    // Check that the dummy user was removed from allMembers
    expect(component.allMembers).toEqual([]);
  })

  // Test if the open function works correctly when there are other users in the project
  it('should open the add user modal and add the new user to the project without removing the other users', async () => {
    // Creates dummy input
    let dummyUser1 = new User(8, "something");
    let dummyUser2 = new User(10, "AnotherUser");
    // Instance of NgbModalRef
    modalRef = modalService.open(AddUsersModalComponent);
    // Set the value of componentInstance.addUserEvent to the dummy input
    modalRef.componentInstance.addUserEvent = of(dummyUser1);
    // Set the value of projectMembers to a lis
    component.projectMembers = [dummyUser2];
    // Set the value of allMembers to a list containing just the dummy input
    component.allMembers = [dummyUser1];

    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)

    // Call the open function
    component.open();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(AddUsersModalComponent);
    // Check that the dummy user was added to projectMembers
    expect(component.projectMembers).toEqual([dummyUser2, dummyUser1]);
    // Check that the dummy user was removed from allMembers
    expect(component.allMembers).toEqual([]);
  })
});
