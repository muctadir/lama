import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Project } from 'app/classes/project';
import { User } from 'app/classes/user';
import { ProjectDataService } from './project-data.service';

/**
 * Test bed for project data service
 */
describe('ProjectDataService', () => {
  let service: ProjectDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(ProjectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the projects from the backend', async () => {
    // Creates the spy on the get request, and returns dummy output
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      [{
        "project": {
          "id": 1,
          "name": "project1",
          "description": "desc1",
          "frozen": false
        },
        "projectNrArtifacts": 6,
        "projectNrCLArtifacts": 5,
        "projectUsers": [
          {"id": 1, "name": "user1", "description": "desc1", "email": "u1@u1.com"},
          {"id": 2, "name": "user2", "description": "desc2", "email": "u2@u2.com"}
        ],
        "projectAdmin": true
      },
      {
        "project": {
          "id": 2,
          "name": "project2",
          "description": "desc2",
          "frozen": true
        },
        "projectNrArtifacts": 9,
        "projectNrCLArtifacts": 6,
        "projectUsers": [
          {"id": 1, "name": "user1", "description": "desc1", "email": "u1@u1.com"}
        ],
        "projectAdmin": true
      }]
    ));

    // Makes the call to get the projects, stores the results
    let result = await service.getProjects();

    // Checks whether the spy is created succesfully
    expect(spy).toHaveBeenCalled();

    // Creates the user objects
    let u1 = { id: 1, name: 'user1', description: 'desc1', email: 'u1@u1.com' };
    let u2 = { id: 2, name: 'user2', description: 'desc2', email: 'u2@u2.com' };

    // Creates project 1
    let p1 = new Project(1, "project1", "desc1");
    p1.setFrozen(false);
    p1.setNumberOfArtifacts(6);
    p1.setNumberOfCLArtifacts(5);
    p1.setAdmin(true);
    // @ts-ignore: type error, can be ignored in this case
    p1.setUsers([u1, u2]);
    
    // Creates project 2
    let p2 = new Project(2, "project2", "desc2");
    p2.setFrozen(true);
    p2.setNumberOfArtifacts(9);
    p2.setNumberOfCLArtifacts(6);
    p2.setAdmin(true);
    // @ts-ignore: type error, can be ignored in this case
    p2.setUsers([u1]);

    // Checks whether the result is equal to the projects we have created
    expect(result).toEqual([p1, p2]);
  });

  it('should get all the users from the backend', async () => {
    // Creates a spy
    spyOn(service["requestHandler"], "get").and.returnValue(Promise.resolve(
      [{id: 1, username: "name1", email: "one@one.com", description: "desc1"}, 
      {id: 2, username: "name2", email: "two@two.com", description: "desc2"}]
    ));

    // Calls the function
    let result = await service.getUsers();

    // Creates the dummy result
    let user1 = new User(1, "name1");
    user1.setEmail("one@one.com");
    user1.setDesc("desc1");
    let user2 = new User(2, "name2"); 
    user2.setEmail("two@two.com");
    user2.setDesc("desc2");
    let output = [user1, user2];

    // Checks whether output is correct
    expect(result).toEqual(output);
  });

  it('should make the request to create a project', async () => {
    // Creates the spy on the post request
    let spy = spyOn(service.requestHandler, "post");

    // Calls the function to be tested
    await service.makeRequest({a: "a"});

    // Checks whether the backend call was made correctly
    expect(spy).toHaveBeenCalledWith("/project/creation", {a: "a"}, true)
  });

  it('should return that the project is frozen', async () => {
    // Creates the spy on the get request
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve({"frozen": true}));

    // Calls the function to be tested
    let result = await service.getFrozen();

    // Checks the results
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should return error message if frozen request throws error', async () => {
    // Creates the spy on the get request
    let spy = spyOn(service.requestHandler, "get").and.throwError(new Error("this is an error"));
    // Creates spy for the toast message
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Calls the function to be tested
    await service.getFrozen();      

    // Checks the results
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when loading data from the server"])
    expect(spy).toHaveBeenCalled();
  });

});
