import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Label } from 'app/classes/label';
import { StringArtifact } from 'app/classes/stringartifact';
import { User } from 'app/classes/user';
import { Router } from '@angular/router';
import { ConflictResolutionComponent } from './conflict-resolution.component';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { FormBuilder } from '@angular/forms';

/**
 * Test bed for conflict resolution component
 */
describe('ConflictResolutionComponent', () => {
  let component: ConflictResolutionComponent;
  let fixture: ComponentFixture<ConflictResolutionComponent>;
  let router: Router

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictResolutionComponent ],
      imports: [RouterTestingModule],
      providers: [NgbActiveModal, FormBuilder]
    })
    .compileComponents();
    router = TestBed.inject(Router)
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
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

  it('should get the labels by type', async () => {
    // Creates dummy input
    let input = [
      {
        "id": 1,
        "name": "label1",
        "description": "desc1"
      },
      {
        "id": 2,
        "name": "label2",
        "description": "desc2"
      }
    ];

    // Creates the spy returning the dummy input
    let spy = spyOn(component["conflictDataService"], "getLabelsByType").and.returnValue(Promise.resolve(input));

    // Sets the label type of the component
    component.label_type = "type1"

    // Calls function to be tested
    await component.getLabelsByType(1, 2);

    // Checks the conditions
    expect(spy).toHaveBeenCalled();
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type1");
    expect(component.labels).toEqual([l1, l2]);
  });

  it('should update the labelling',async () => {
    // Creates a spy on the updateLabelling function
    let spy = spyOn(component["labellingDataService"], "updateLabelling").and.returnValue(Promise.resolve({"test": true}));

    // Sets some data
    let user = new User(1, "user1");
    component.label_per_user = {"user1": {}};

    // Calls the function to be tested
    await component.updateLabelling(user, "label1");

    // does some tests
    expect(spy).toHaveBeenCalled();
    expect(component.label_per_user).toEqual({"user1": {"test": true}});
  });

  it('should update the labellings', async () => {
    // Initializes some data
    component.label_per_user = {"user1": {"type1": "a", "test": "a"}, "user2": {"type1": "b", "test": "b"}};
    component.p_id = 8;

    // Creates spies on some of the function calls
    let spy = spyOn(component["labellingDataService"], "updateLabellings");
    let spy2 = spyOn(component, "oneLabel").and.returnValue(true);

    // Creates a spy on the toast and router
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    let spyRouter = spyOn(component["router"], "navigate");

    // Calls the function to be tested
    await component.updateLabellings();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Conflict resolved successfully"]);
    expect(spyRouter).toHaveBeenCalledWith(['/project', 8, 'conflict'])
    expect(component.users).toEqual([]);
  });

  it('should update the labellings, but error occurs in backend call', async () => {
    // Initializes some data
    component.label_per_user = {"user1": {"type1": "a", "test": "a"}, "user2": {"type1": "b", "test": "b"}};
    component.p_id = 8;

    // Creates spies on some of the function calls
    let spy = spyOn(component["labellingDataService"], "updateLabellings").and.throwError(new Error("test"));

    // Calls the function to be tested
    let result = await component.updateLabellings();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should update the labellings, but conflict is still not resolved', async () => {
    // Initializes some data
    component.label_per_user = {"user1": {"type1": "a", "test": "a"}, "user2": {"type1": "b", "test": "b"}};
    component.p_id = 8;

    // Creates spies on some of the function calls
    let spy = spyOn(component["labellingDataService"], "updateLabellings");
    let spy2 = spyOn(component, "oneLabel").and.returnValue(false);

    // Creates a spy on the toast and router
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.updateLabellings();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Conflict has not been resolved."]);
  });

  it('should return false since there is more than 1 label', async () => {
    // Sets some variables in the component
    component.label_per_user = {"a": {"name": "name1"}, "b": {"name": "name2"}} ;

    // Calls function to be tested
    let result = component.oneLabel();

    // Checks the results
    expect(result).toBeFalsy();
  });

  it('should return true since there is 1 label', async () => {
    // Sets some variables in the component
    component.label_per_user = {"a": {"name": "name1"}, "b": {"name": "name1"}} ;

    // Calls function to be tested
    let result = component.oneLabel();

    // Checks the results
    expect(result).toBeTruthy();
  });

  it('should split the artifact', async () => {
    // Sets variables in the component for test case
    component.selectionStartChar = 100;
    component.selectionEndChar = 200;
    // Creates some spies
    spyOn(component, "startPosFixer").and.returnValue(100);
    spyOn(component, "endPosFixer").and.returnValue(200);
    // Spy for service
    let spyServ = spyOn(component["artifactDataService"], "postSplit").and.returnValue(Promise.resolve(3));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.split();

    // Checks the function calls
    expect(spyServ).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Artifact was successfully split into artifact #" + 3]);
  });

  it('should test selectedText where start char > end char', () => {
    // Creates spies for function calls
    // @ts-ignore: Complains about type, but should be fine for test case
    let spyLabel = spyOn(document, "getSelection").and.returnValue({anchorOffset: 300, focusOffset: 200});

    // Makes the function call
    component.selectedText();

    // Checks whether function was called
    expect(spyLabel).toHaveBeenCalled();
    // Checks whether variables are correct
    expect(component.selectionStartChar).toBe(200);
    expect(component.selectionEndChar).toBe(300);
    // Checks whether we are indeed in second case
    expect(component.hightlightedText).toBe({anchorOffset: 300, focusOffset: 200}.toString());
  });

  it('should test selectedText where nothing selected', () => {
    // Creates spies for function calls
    // @ts-ignore: Complains about type, but should be fine for test case
    let spyLabel = spyOn(document, "getSelection");

    // Makes the function call
    component.selectedText();

    // Checks whether function was called
    expect(spyLabel).toHaveBeenCalled();
    // Checks whether variables are correct
    expect(component.selectionStartChar).toBeUndefined();
    expect(component.selectionEndChar).toBeUndefined();
    // Checks whether we are indeed in second case
    expect(component.hightlightedText).toBe("");
  });

  it('should test startPosFixer case 1', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd");

    // Calls the function to be tested
    let result = component.startPosFixer(2);

    // Tests the results
    expect(result).toBe(3);
  })

  it('should test startPosFixer case 2', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd");

    // Calls the function to be tested
    let result = component.startPosFixer(0);

    // Tests the results
    expect(result).toBe(0);
  })

  it('should test startPosFixer case 3', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab abcd");

    // Calls the function to be tested
    let result = component.startPosFixer(5);

    // Tests the results
    expect(result).toBe(2);
  });

  it('should test endPosFixer case 1', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd de");

    // Calls the function to be tested
    let result = component.endPosFixer(8);

    // Tests the results
    expect(result).toBe(8);
  });

  it('should test endPosFixer case 2', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd d ");

    // Calls the function to be tested
    let result = component.endPosFixer(1);

    // Tests the results
    expect(result).toBe(3);
  });

  it('should test endPosFixer case 3', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cdd ");

    // Calls the function to be tested
    let result = component.endPosFixer(3);

    // Tests the results
    expect(result).toBe(2);
  });

  it('should reroute', () => {
    // Sets variables
    component.p_id = 8;

    // Creates the spy for the router
    let spy = spyOn(component["router"], "navigate");

    // Calls the function to be tested
    component.reRouter();

    // Checks the function call
    expect(spy).toHaveBeenCalledWith(['/project', 8, 'conflict']);
  });

  // Test if the openCreateForm function works correctly
  it('should open the create label modal, clear label cache and reinitialize page', async () => {
    // Put a label in  the cache of labels
    component.labels = [new Label(1, "Some label", "Some description", "Some type")];

    // Instance of NgbModalRef
    modalRef = modalService.open(LabelFormComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on ngOnInit and stub the call
    let init_spy = spyOn(component, 'ngOnInit');

    // Call the open function
    component.openCreateForm();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open was called with the right parameters
    expect(modal_spy).toHaveBeenCalledWith(LabelFormComponent, { size: 'xl' });
    // Check if the cache of labels is cleared
    expect(component.labels).toEqual([]);
    // Check that the page is reinitialized
    expect(init_spy).toHaveBeenCalled();
  });
});
