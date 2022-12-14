import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SingleArtifactViewComponent } from './single-artifact-view.component';
import { StringArtifact } from 'app/classes/stringartifact';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryComponent } from 'app/modals/history/history.component';
import { LabelType } from 'app/classes/label-type';
import { User } from 'app/classes/user';

describe('SingleArtifactViewComponent', () => {
  let component: SingleArtifactViewComponent;
  let fixture: ComponentFixture<SingleArtifactViewComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;

  // Data of an artifact
  let artifact_data = {
    "result": new StringArtifact(12, 'IDENT', 'This artifact is here just for testing purposes'),
    "labellings": {
      "User1": {
        "LT1": {
          "description": "Doesn't matter what is here",
          "name": "Label 1",
          "lt_name": "LT1",
          "id": 1,
          "u_id": 2,
          "lt_id": 1,
          "labelRemark": "Some remark"
        },
        "LT2": {
          "description": "Same as above",
          "name": "Label 2",
          "lt_name": "LT2",
          "id": 2,
          "u_id": 2,
          "lt_id": 2,
          "labelRemark": "Some remark"
        }
      },
      "User2": {
        "LT1": {
          "description": "These should still be somewhat consistent",
          "name": "Label 3",
          "lt_name": "LT1",
          "id": 3,
          "u_id": 3,
          "lt_id": 1,
          "labelRemark": "Some remark"
        },
        "Lt2": {
          "description": "Ok this hardcoded thingy is done",
          "name": "Label 4",
          "lt_name": "LT2",
          "id": 4,
          "u_id": 3,
          "lt_id": 2,
          "labelRemark": "Some remark"
        }
      }
    },
    "username": "BestUsernameInTheWorld",
    "admin": true,
    "users": [
      {
        "id": 2,
        "username": "User1"
      },
      {
        "id": 3,
        "username": "User2"
      }]
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule and SingleArtifactViewComponent dependencies
      imports: [RouterTestingModule],
      declarations: [SingleArtifactViewComponent],
      providers: [NgbActiveModal]
    })
    .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleArtifactViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests that ngOnInit works correctly
  it('should initialize correctly', async () => {
    // Spy on projectDataService.getFrozen and return false
    spyOn(component['projectDataService'], 'getFrozen').and.returnValue(Promise.resolve(false));
    // Spy on getArtifact and stub the call
    let spy1 = spyOn(component, 'getArtifact');
    // Spy on getLabelTypesWithLabels and stub the call
    let spy2 = spyOn(component, 'getLabelTypesWithLabels');

    // Calls the function to be tested
    await component.ngOnInit();

    // Checks the results
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Tests that getArtifact works correctly
  it('should get the artifact and its data', async () => {
    // When artifactDataService.getArtifact is called, return the following data
    let spy = spyOn(component['artifactDataService'], 'getArtifact').and.returnValue(Promise.resolve(artifact_data))

    // Call the function and wait until it's done
    await component.getArtifact(12, 1);

    // Check that artifactDataService.getArtifact was called with the right parameters
    expect(spy).toHaveBeenCalled();

    // Check that the artifact data was set correctly
    expect(component.artifact).toEqual(artifact_data["result"]);
    expect(component.userLabels).toEqual(artifact_data["labellings"]);
    expect(component.username).toEqual(artifact_data["username"]);
    expect(component.admin).toEqual(artifact_data["admin"]);
  });

  // Tests that openArtifactHistory works correctly
  it('should open the artifact history modal', async () => {
    // Instance of NgbModalRef
    let modalRef = modalService.open(HistoryComponent);
    // Spy on the .modalService.open function and stub the call
    spyOn(component['modalService'], 'open').and.returnValue(modalRef);

    // Call the function
    component.openArtifactHistory();
    // Close the modalRef
    await modalRef.close();

    // Check that modalService.open was called
    expect(modalService.open).toHaveBeenCalledWith(HistoryComponent, { size: 'xl' });
  });

  // Tests that getLabelTypesWithLabels sets the right label types
  it('should set the correct labels', async () => {
    let labelTypes = [new LabelType(1, "lt1", [])];
    // When labellingDataService.getLabelTypesWithLabels gets called, return the following array of labels
    let spy = spyOn(component['labellingDataService'], 'getLabelTypesWithLabels').and
      .returnValue(Promise.resolve(labelTypes));

    // Call the function and wait until it's done
    await component.getLabelTypesWithLabels(1)

    // Check that the labellingDataService.getLabelTypesWithLabels function was called
    // with the right parameters
    expect(spy).toHaveBeenCalledWith(1);

    // Check that the label types were set correctly
    expect(component.labelTypes).toEqual(labelTypes)
  });

  // Tests that updateLabelling works correctly
  it('should update userLabels and changed', () => {
    // Make a user
    let user = new User(2, "User1");
    // Set userLabels
    component.userLabels = artifact_data['labellings']
    // When labellingDataService.updateLabelling is called, return the following
    spyOn(component['labellingDataService'], 'updateLabelling').and
      .returnValue({
        "description": "Updated description",
        "name": "Label 5",
        "lt_name": "LT2",
        "id": 5,
        "u_id": 2,
        "lt_id": 2
      });

    // Call the function
    component.updateLabelling(user, "Label 5", 2, []);

    // Check that labellingDataService.updateLabelling was called with the right parameters
    expect(component['labellingDataService'].updateLabelling).toHaveBeenCalled();

    // Check that the labelling was updated
    expect(component.userLabels["User1"]["LT2"]["description"]).toEqual("Updated description");
    expect(component.userLabels["User1"]["LT2"]["name"]).toEqual("Label 5");
    expect(component.userLabels["User1"]["LT2"]["lt_name"]).toEqual("LT2");
    expect(component.userLabels["User1"]["LT2"]["id"]).toEqual(5);
    expect(component.userLabels["User1"]["LT2"]["u_id"]).toEqual(2);
    expect(component.userLabels["User1"]["LT2"]["lt_id"]).toEqual(2);
    expect(component.userLabels["User1"]["LT2"]["labelRemark"]).toEqual("Some remark");
    expect(component.changed).toEqual(true);
  });

  // Tests that updateLabelling works correctly
  it('should not update userLabels when the updated label is null', () => {
    // Make a user
    let user = new User(2, "User1");
    // Set userLabels
    component.userLabels = artifact_data['labellings']
    // When labellingDataService.updateLabelling is called, return the following
    spyOn(component['labellingDataService'], 'updateLabelling').and
      .returnValue(null);

    // Call the function
    component.updateLabelling(user, "Label 5", 2, []);

    // Check that labellingDataService.updateLabelling was called with the right parameters
    expect(component['labellingDataService'].updateLabelling).toHaveBeenCalled();

    // Check that the labelling was not updated
    expect(component.userLabels["User1"]["LT2"]).toEqual(artifact_data["labellings"]["User1"]["LT2"]);
  });

  // Tests that updateLabellings works correctly
  it('should update the labellings and display a success toast', async () => {
    // Set the artifact details
    component.admin = artifact_data['admin'];
    component.p_id = 1;
    component.a_id = 12;
    component.username = artifact_data['username'];
    component.userLabels = artifact_data['labellings'];

    // Spy on labellingDataService.updateLabellings and stub the call
    let labellings_spy = spyOn(component['labellingDataService'], 'updateLabellings');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');
    spyOn(component, "ngOnInit");

    // Call the function and wait until it's done
    await component.updateLabellings()

    // Check that labellingDataService.updateLabellings is called with the right parameters
    expect(labellings_spy).toHaveBeenCalledWith(
      artifact_data['admin'], 1, 12, artifact_data['username'], artifact_data['labellings'])

    // Check that the success toast is being called
    expect(toast_spy).toHaveBeenCalledWith([true, "New labels saved successfully!"]);
    
  });

  // Tests that updateLabellings displays an error toast when needed
  it('should display a failure toast', async () => {
    // Spy on labellingDataService.updateLabellings and throw an error
    let spy = spyOn(component['labellingDataService'], 'updateLabellings').and.throwError("Test error.")
    spyOn(component, "ngOnInit");

    // Spy on toastCommService.emitChange and stub the call
    spyOn(component["toastCommService"], "emitChange");

    // Call the function and wait until it's done
    await component.updateLabellings()

    // Check that labellingDataService.updateLabellings is called with the right parameters
    expect(spy).toHaveBeenCalled();

    // Check that the success toast is being called
    expect(component['toastCommService'].emitChange).toHaveBeenCalledWith([false, "Something went wrong while saving."]);
  
  })
});
