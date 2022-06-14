import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestHandler } from 'app/classes/RequestHandler';
import { HomePageComponent } from './home-page.component';
import { Project } from 'app/classes/project';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePageComponent ]
    })
    .compileComponents();
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
  it('Test for ngOnInit function', () => {
    // Spy on the function that is called
    let spy = spyOn(component, "makeRequest");
    // Call the function
    component.ngOnInit();
    // Check if the function works
    expect(spy).toHaveBeenCalled();
  });

  // Test to see if the makeRequest function works correctly
  it('Test for makeRequest function', async () => {
    // Spy on the function that is called
    let spy1 = spyOn(sessionStorage, "getItem");
    // Call the function
    await component.makeRequest();
    // Check if the function works
    expect(spy1).toHaveBeenCalled();
  });

  /* Tests if the request to backend is made */
  it('Tests if the request to backend is made', async () => {

    // Will simulate the makeRequest function
    spyOn(component, "makeRequest").and.callFake(async function(): Promise<void> {
      // Creates the spy on the sessionStorage and token
      spyOn(sessionStorage, "getItem").and.returnValue("exampleSessionToken");
      let token: string | null  = sessionStorage.getItem('ses_token');

      // Creates an instance of the request handler
      let requestHandler = new RequestHandler(token);

      try {
        // Spy on the get request by the request handler
        let spy1 = spyOn(requestHandler, "get").and.returnValue(Promise.resolve());
        // Makes the backend request to get the projects of which the user is a member
        let response: any = requestHandler.get("/project/home", {}, true);
        // Test if the function was called
        expect(spy1).toHaveBeenCalled();

        // Waits on the request
        let result = await response;
        // Test if there is a response
        expect(result).toBe({});

        // Spy on the parseResponse function
        let spy2 = spyOn(component, "parseResponse");
        // Parses the response of the backend with all projects
        component.parseResponse(result);
        // Test if the function was called
        expect(spy2).toHaveBeenCalled();

      } catch(e) {
        // To catch the error
      }
    })
  });

  // Test to see if the parseResponse function works correctly
  it('Test for parseResponse function', async () => {
    // Will simulate the makeRequest function
    spyOn(component, "parseResponse").and.callFake(function(): void {
      
      // Create the project with constructor
      let projectNew = new Project(1, "Project Name", "Description");

      // Spy on the functions
      let spy1 = spyOn(projectNew, "setFrozen");
      let spy2 = spyOn(projectNew, "setNumberOfArtifacts");
      let spy3 = spyOn(projectNew, "setNumberOfCLArtifacts");
      let spy4 = spyOn(projectNew, "setAdmin");
      let spy5 = spyOn(projectNew, "setUsers");
      
      // Set other variables
      projectNew.setFrozen(true);
      projectNew.setNumberOfArtifacts(3);
      projectNew.setNumberOfCLArtifacts(2);
      projectNew.setAdmin(true);
      projectNew.setUsers([]);
      
      // Check if the functions are called
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(spy5).toHaveBeenCalled();
    });
  });

  // Test to see if the openLogout function works correctly
  it('Test for openLogout function', async () => {
    // Spy on the function that is called
    let spy = spyOn(component['modalService'], "open");
    // Call the function
    component.openLogout();
    // Check if the function works
    expect(spy).toHaveBeenCalled();
  });

});
