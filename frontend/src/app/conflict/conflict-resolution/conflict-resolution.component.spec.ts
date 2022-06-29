import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StringArtifact } from 'app/classes/stringartifact';
import { User } from 'app/classes/user';
import { ConflictResolutionComponent } from './conflict-resolution.component';

/**
 * Test bed for conflict resolution component
 */
fdescribe('ConflictResolutionComponent', () => {
  let component: ConflictResolutionComponent;
  let fixture: ComponentFixture<ConflictResolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictResolutionComponent ],
      imports: [RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.p_id = 1;
    component.url = "/project/1/conflict"
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component with ngOnInit', async () => {
    // Creates the spies on the function calls
    let spy1 = spyOn(component["routeService"], "getArtifactConflict").and.returnValue(["1", "2", "3"]);
    let spy2 = spyOn(component, "getArtifact");
    let spy3 = spyOn(component, "getLabelPerUser");
    let spy4 = spyOn(component, "getLabelsByType");
    let spy5 = spyOn(component["projectDataService"], "getFrozen");

    // Calls the function to be tested
    await component.ngOnInit();

    // Checks whether each function is called
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  it('should get the artifact from the backend', async () => {
    // Creates a dummy artifact
    let art = new StringArtifact(1, "a", "data1");

    // Stubs the getArtifact call and returns dummy data
    spyOn(component["artifactDataService"], "getArtifact").and.returnValue(Promise.resolve(
      {"result": art,
      "labellings": [],
      "username": "user1",
      "u_id": 1,
      "admin": true,
      "users": []}
    ));

    // Calls function to be tested
    await component.getArtifact(1, 2);

    // Does some checks
    expect(component.artifact).toEqual(art);
    expect(component.username).toEqual("user1");
    expect(component.admin).toBeTrue();
  });

  it('should get the labels per user', async () => {
    // Creates dummy input
    let input = {
      "user1": {
        "id": 1,
        "name": "label1",
        "u_id": 9,
        "description": "desc1",
        "lt_id": "type1"
      },
      "user2": {
        "id": 2,
        "name": "label2",
        "u_id": 8,
        "description": "desc2",
        "lt_id": "type1"
      },
    };

    // Creates the spy returning the dummy input
    let spy = spyOn(component["conflictDataService"], "getLabelPerUser").and.returnValue(Promise.resolve(input));

    // Calls function to be tested
    await component.getLabelPerUser(1, 2, 3);

    // Checks the conditions
    expect(spy).toHaveBeenCalled();
    expect(component.label_per_user).toEqual(input);
    let u1 = new User(9, "user1");
    let u2 = new User(8, "user2");
    expect(component.users).toEqual([u1, u2]);
  });





});
