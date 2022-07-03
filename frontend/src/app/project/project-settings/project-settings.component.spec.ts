import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectSettingsComponent } from './project-settings.component';
import { FormBuilder } from '@angular/forms';
import { User } from 'app/classes/user';
import { Project } from 'app/classes/project';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

/**
 * Test bed for the project settings component
 */
describe('ProjectSettingsComponent', () => {
  let component: ProjectSettingsComponent;
  let fixture: ComponentFixture<ProjectSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSettingsComponent],
      imports: [RouterTestingModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component correctly', () => {
    // Creates the spies
    let spy2 = spyOn(component, "requestUsers");
    let spy3 = spyOn(component, "requestCurrentProject");

    // Calls the function to be tested
    component.ngOnInit();

    // Does the checks
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should get the users from the backend', async () => {
    // Creates the spies
    let spy = spyOn(component["requestHandler"], "get").and.returnValue(Promise.resolve(
      [
        {
          id: 1,
          username: "user1",
          description: "desc1",
          email: "u1@u1.com"
        },
        {
          id: 2,
          username: "user2",
          description: "desc2",
          email: "u2@u2.com"
        }
      ]
    ));

    // Calls the function to be tested
    await component.requestUsers();

    // Creates the dummy user objects
    let u1 = new User(1, "user1");
    u1.setDesc("desc1");
    u1.setEmail("u1@u1.com");
    let u2 = new User(2, "user2");
    u2.setDesc("desc2");
    u2.setEmail("u2@u2.com");

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(component.allMembers).toEqual([u1, u2]);
  });

  it('should get the users from the backend, but an error occurs', async () => {
    // Creates the spies
    let spy = spyOn(component["requestHandler"], "get").and.throwError(new Error("test"));
    // Create spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.requestUsers();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when loading data from the server"]);
  });

  it('should get the current project', async () => {
    // Set some values initially
    let user = new User(2, "user2");
    component.allMembers = [user];

    // Creates a spy for the backend call, returns dummy values
    spyOn(component["requestHandler"], "get").and.returnValue(Promise.resolve(
      {
        u_id: 1,
        name: "project1",
        description: "pdesc1",
        criteria: 2,
        frozen: false,
        labelType: [{label_type_id: 1, label_type_name: "lt1"}],
        users: [
          {
            id: 1,
            username: "user1",
            removed: false,
            super_admin: true,
            admin: true
          },
          {
            id: 2,
            username: "user2",
            removed: false,
            super_admin: false,
            admin: false
          },
          {
            id: 3,
            username: "user3",
            removed: true,
            super_admin: false,
            admin: true
          }
        ]
      }
    ));

    // Calls the function to be tested
    await component.requestCurrentProject();

    // Creates the project
    let proj = new Project(0, "project1", "pdesc1");
    proj.setCriteria(2);
    proj.setFrozen(false);

    let u1 = new User(1, "user1");
    let u2 = new User(2, "user2");
    proj.setUsers([u1, u2]);

    // Checks whether the project was created correctly
    expect(component.currentProject).toEqual(proj);

    // Checks all the members
    expect(component.allMembers).toEqual([]);

    // Checks all the project members 
    expect(component.projectMembers).toEqual([u1, u2]);
    
    // Checks whether user 1 is the super admin
    expect(component.superAdminID).toEqual(1);

    // Checks whether the labelTypes are correct
    expect(component.labelTypes).toEqual(["lt1"]);
  });

  it('should get the current project, but an error occurs', async () => {
    // Creates a spy for the backend call, returns dummy values
    let spy = spyOn(component["requestHandler"], "get").and.throwError(new Error("test"));
    // Makes spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    await component.requestCurrentProject();

    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when loading data from the server"])
  });

  it('should send an update project settings request', async () => {
    // Creates a spy for the backend call
    let spy = spyOn(component["requestHandler"], "patch").and.returnValue(Promise.resolve("Ok"));
    // Creates a spy for the toasts
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.sendUpdateRequest(1);

    // Checks the call for the backend
    expect(spy).toHaveBeenCalled();
    // Checks the variables
    expect(component.added).toEqual([]);
    expect(component.removedMembers).toEqual([]);
    // checks the toast emitted
    expect(spyToast).toHaveBeenCalledWith([true, "Edit successful"]);
  });

  it('should send an update project settings request some values initialized', async () => {
    // Creates a spy for the backend call
    let spy = spyOn(component["requestHandler"], "patch").and.returnValue(Promise.resolve("Ok"));
    // Creates a spy for the toasts
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // initializes some values
    component.allProjectMembers[1] = new User(1, "user1");
    component.allProjectMembers[2] = new User(2, "user2");
    component.added[1] = 1;
    component.removed[1] = 1;
    component.added[2] = 1;
    component.removed[2] = 0;

    // Calls the function to be tested
    await component.sendUpdateRequest(1);

    // Checks the call for the backend
    expect(spy).toHaveBeenCalled();
    // Checks the variables
    expect(component.added).toEqual([]);
    expect(component.removedMembers).toEqual([]);
    expect(component.removed).toEqual({1: 0, 2: 0});
    // checks the toast emitted
    expect(spyToast).toHaveBeenCalledWith([true, "Edit successful"]);
  });

  it('should send an update project settings request, but an error 511 occurs', async () => {
    // Creates a spy for the backend call
    let spy = spyOn(component["requestHandler"], "patch").and.throwError(new TestError("msg", {status: 511}));
    // Creates a spy for the toasts
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Create spy for function call
    let spy2 = spyOn(component, "unclickEdit");

    // Calls the function to be tested
    await component.sendUpdateRequest(1);

    // Checks the call for the backend
    expect(spy).toHaveBeenCalled();
    // checks the toast emitted
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains a forbidden character: \\ ; , or #"]);
    // checks the function call at the end of the error block
    expect(spy2).toHaveBeenCalled();
  });

  it('should send an update project settings request, but a whitespace error occurs', async () => {
    // Creates a spy for the backend call
    let spy = spyOn(component["requestHandler"], "patch")
      .and.throwError(new TestError("msg", {status: 69, data: "Input contains leading or trailing whitespaces"}));
    // Creates a spy for the toasts
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Create spy for function call
    let spy2 = spyOn(component, "unclickEdit");

    // Calls the function to be tested
    await component.sendUpdateRequest(1);

    // Checks the call for the backend
    expect(spy).toHaveBeenCalled();
    // checks the toast emitted
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains leading or trailing whitespaces"]);
    // checks the function call at the end of the error block
    expect(spy2).toHaveBeenCalled();
  });

  it('should send an update project settings request, but an error occurs', async () => {
    // Creates a spy for the backend call
    let spy = spyOn(component["requestHandler"], "patch")
      .and.throwError(new TestError("msg", {status: 69, data: "something"}));
    // Creates a spy for the toasts
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Create spy for function call
    let spy2 = spyOn(component, "unclickEdit");

    // Calls the function to be tested
    await component.sendUpdateRequest(1);

    // Checks the call for the backend
    expect(spy).toHaveBeenCalled();
    // checks the toast emitted
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured while creating the theme"]);
    // checks the function call at the end of the error block
    expect(spy2).toHaveBeenCalled();
  });

  it('should change to edit mode', () => {
    // Creates the spy on the service
    let spy = spyOn(component["editModeService"].isInEditMode, "next");

    // Calls the function to be tested
    component.clickEdit();

    // Checks whether the service was called
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should change to non-edit mode', () => {
    // Creates the spy on the service
    let spy = spyOn(component["editModeService"].isInEditMode, "next");
    // Creates the spy for the ngOnInit call
    let spy2 = spyOn(component, "ngOnInit");

    // Calls the function to be tested
    component.unclickEdit();

    // Checks whether the function calls
    expect(spy).toHaveBeenCalledWith(false);
    expect(spy2).toHaveBeenCalled();

    // Checks the values
    expect(component.projectMembers).toEqual([]);
    expect(component.labelTypes).toEqual([]);
    expect(component.allMembers).toEqual([]);
  });

  it('should save the changes made to the project settings', async () => {
    // Creates the spy for function call
    let spy1 = spyOn(component, "setCurrenProjectInfo");
    // Creates the spy on the service
    let spy2 = spyOn(component["editModeService"].isInEditMode, "next");
    // creates spy for final function call
    let spy3 = spyOn(component, "sendUpdateRequest");

    // Sets some initial values
    let proj = new Project(1, "project1", "pdesc1");
    component.currentProject = proj;

    component.allProjectMembers[1] = new User(1, "user1");
    component.allProjectMembers[2] = new User(2, "user2");
    component.added[1] = 1;

    // Calls the function to be tested
    await component.saveEdit();

    // does some checks
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(false);

    let input = {
      "project": {"id": 1, "name": "project1", "description": "pdesc1", "criteria": undefined, "frozen": undefined},
      "update": {2: {"id": 2, "name": "user2", "removed": undefined, "admin": NaN}},
      "add": {1: {"id": 1, "name": "user1", "removed": undefined, "admin": NaN}}
    };

    // Checks whether the final function call was made with the correct parameters
    expect(spy3).toHaveBeenCalledWith(input);
  });

  it('should set the current project information with multiple users', () => {
    // Calls the function to be tested
    let u1 = new User(1, "user1");
    let u2 = new User(2, "user2");

    // @ts-ignore: types for the html return element
    spyOn(document, "getElementById").and.returnValue({checked: true});

    // Creates the spy on the service
    let spy2 = spyOn(component["editModeService"].isInEditMode, "next");

    // sets some values
    component.projectMembers = [u1, u2];

    // Calls the function to be tested
    component.setCurrenProjectInfo("project1", "pdesc1", 3, true, [u1, u2]);

    // Does some checks
    expect(component.adminMembers[1]).toEqual(true);
    expect(component.adminMembers[2]).toEqual(true);

    // Creates a project
    let proj = new Project(0, "project1", "pdesc1");
    proj.setCriteria(3);
    proj.setFrozen(true);
    proj.setUsers([u1, u2]);

    // Checks the project to the project object
    expect(component.currentProject).toEqual(proj);

    // Checks the edit mode service
    expect(spy2).toHaveBeenCalledWith(false);
  });

  it('should add member to the project', () => {
    // Creates the user we want to add
    let user = new User(1, "user1");

    // Sets some default values
    component.removedMembers = {1: {name: "user1"}};
    component.allMembers = [user];

    // Spies on the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    component.addMember(user, true);

    // Does some checks
    expect(component.removedMembers).toEqual({});
    expect(component.removed).toEqual({1: 0});
    expect(component.projectMembers).toEqual([user]);
    expect(component.allMembers).toEqual([]);
    expect(spyToast).toHaveBeenCalledWith([true, "User added"]);
  });

  it('should add member to the project case 2', () => {
    // Creates the user we want to add
    let user = new User(1, "user1");

    // Sets some default values
    component.allMembers = [user];

    // Spies on the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    component.addMember(user, true);

    // Does some checks
    expect(component.allProjectMembers).toEqual({1: user});
    expect(component.added).toEqual({1: 1});
    expect(component.removed).toEqual({1: 0});
    expect(component.projectMembers).toEqual([user]);
    expect(component.allMembers).toEqual([]);
    expect(spyToast).toHaveBeenCalledWith([true, "User added"]);
  });

  it('should remove member of the project', () => {
    // Creates the user we want to add
    let user = new User(1, "user1");

    // Sets some default values
    component.allMembers = [];
    component.added = {1: 1};
    component.allProjectMembers = {1: user}
    component.projectMembers = [user]
    component.adminMembers = {};

    // Calls function to be tested
    component.removeMember(user);

    // Does some checks
    expect(component.projectMembers).toEqual([]);
    expect(component.allMembers).toEqual([user]);
    expect(component.allProjectMembers).toEqual({});
    expect(component.added).toEqual({});
    expect(component.adminMembers).toEqual({1: false});
  });

  it('should remove member of the project case 2', () => {
    // Creates the user we want to add
    let user = new User(1, "user1");

    // Sets some default values
    component.allMembers = [];
    component.added = {};
    component.removed = {};
    component.removedMembers = {};
    component.projectMembers = [user];
    component.adminMembers = {};

    // Calls function to be tested
    component.removeMember(user);

    // Does some checks
    expect(component.removed).toEqual({1: 1});
    expect(component.removedMembers).toEqual({1: user});

    expect(component.projectMembers).toEqual([]);
    expect(component.allMembers).toEqual([user]);
    expect(component.adminMembers).toEqual({1: false});
  });

  it('should change the freeze status of a project', () => {
    // Creates the spies
    let spy = spyOn(component["editModeService"].isInEditMode, "next");
    let spy2 = spyOn(component, "sendFreezeRequest");

    // Calls function to be tested
    component.changeFreezeProject(true, false)

    // Checks the conditions which should hold
    expect(component.currentProject.getFrozen()).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(false);
    expect(spy2).toHaveBeenCalledWith({"p_id": 0,"frozen": true});
  });

  it('should make a backend call to change the frozen status', async () => {
    // Creates the spies
    let spy = spyOn(component["requestHandler"], "patch").and.returnValue(Promise.resolve("Ok"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    await component.sendFreezeRequest(true)

    // Checks the conditions which should hold
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Success"]);
  });

  it('should make a backend call to change the frozen status, but an error occurs', async () => {
    // Creates the spies
    let spy = spyOn(component["requestHandler"], "patch").and.throwError(new Error("msg"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    await component.sendFreezeRequest(true)

    // Checks the conditions which should hold
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when loading data from the server"]);
  });
});
