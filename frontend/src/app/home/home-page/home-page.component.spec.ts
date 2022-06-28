import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Project } from 'app/classes/project';
import { User } from 'app/classes/user';
import { HomePageComponent } from './home-page.component';

/**
 * Test suite for the home-page component
 */
describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  // Adds dependencies
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      imports: [RouterTestingModule]
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
});