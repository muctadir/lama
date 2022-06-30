import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectSettingsComponent } from './project-settings.component';
import { FormBuilder } from '@angular/forms';
import { User } from 'app/classes/user';
import { Project } from 'app/classes/project';

/**
 * Test bed for the project settings component
 */
fdescribe('ProjectSettingsComponent', () => {
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
    // create spy for the toast
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
    let spy = spyOn(component["requestHandler"], "get").and.returnValue(Promise.resolve(
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
    let u3 = new User(3, "user3");
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
    // makes spy for the toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    await component.requestCurrentProject();

    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when loading data from the server"])
  });




});
