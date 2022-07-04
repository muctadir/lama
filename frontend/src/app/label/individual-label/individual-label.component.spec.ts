import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IndividualLabelComponent } from './individual-label.component';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { HistoryComponent } from 'app/modals/history/history.component';
import { Label } from 'app/classes/label';
import { FormBuilder } from '@angular/forms';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';
import { of } from 'rxjs';
import { StringArtifact } from 'app/classes/stringartifact';
import { Theme } from 'app/classes/theme';

describe('IndividualLabelComponent', () => {
  let component: IndividualLabelComponent;
  let fixture: ComponentFixture<IndividualLabelComponent>;
  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualLabelComponent],
      // Addis RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal, FormBuilder]
    })
      .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the ngOnInit function
  it('should initialize correctly', async () => {
    // Create spy for get label
    let spy1 = spyOn(component, "getLabel")
    // Create spy for get labellings
    let spy2 = spyOn(component, "getLabellings")
    // Create spy for get labelling amount
    let spy3 = spyOn(component, "getLabellingAmount")
    // Create spy for get frozen status
    let spy4 = spyOn(component['projectDataService'], "getFrozen")
    // Calls the ngOnInit function
    await component.ngOnInit();
    // Checks whether the functions works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  // Test the get label function
  it('should get the label information', async () => {
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "getLabel")
    // create spy for the router
    let routeSpy = spyOn(component["router"], "navigate");
    // Sets variable
    component.p_id = 1;

    // Calls the getLabel function
    await component.getLabel(1, 1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(routeSpy).toHaveBeenCalledWith(['project', 1]);
  });

  it('should get the label information, and change theme', async () => {
    let label = new Label(1, "label1", "desc1", "type1");
    label.setThemes([new Theme(1, "theme1", "desc1")]);

    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "getLabel").and.returnValue(Promise.resolve(label));
    // create spy for the router
    let routeSpy = spyOn(component["router"], "navigate");

    // Sets variable
    component.p_id = 1;

    // Calls the getLabel function
    await component.getLabel(1, 1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(routeSpy).toHaveBeenCalledWith(['project', 1]);
    expect(component.themes).toEqual([new Theme(1, "theme1", "desc1")]);
  });

  // Test the get labelling function
  it('should get the labellings of a label', async () => {
    // Create spy for getLabellings call
    let spy = spyOn(component['labellingDataService'], "getLabelling")
    // create spy for the router
    let routeSpy = spyOn(component["router"], "navigate");
    // Sets variable
    component.p_id = 1;

    // Calls the getLabellings function
    await component.getLabellings(1, 1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(routeSpy).toHaveBeenCalledWith(['project', 1]);
  });

  // Test the postSoftDelete function
  it('should delete the label and display success toast', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(true);
    // List of hardcoded themes
    let artifacts: StringArtifact[] = [];
    // Set the project id 
    component.p_id = 1;
    // Set the label id
    component.label_id = 3;

    // Spy on the functions that should have been called
    let artifact_spy = spyOn(component['label'], 'getArtifacts').and.returnValue(artifacts);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['labellingDataService'], 'postSoftDelete');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.postSoftDelete();

    // Checks whether the function works properly
    expect(artifact_spy).toHaveBeenCalled();
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    expect(delete_spy).toHaveBeenCalledWith({'p_id': 1, 'l_id': 3})
    expect(navigate_spy).toHaveBeenCalledWith(['project', 1, 'labelmanagement'])
    expect(toast_spy).toHaveBeenCalledWith([true, "Successfully deleted label"])
  });

  // Test if the postSoftDelete function displays error toast when postsoftDelete throws an error
  it('should display error toast', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(true);
    // List of hardcoded themes
    let artifacts: StringArtifact[] = [];
    // Set the project id 
    component.p_id = 1;
    // Set the label id
    component.label_id = 3;

    // Spy on the functions that should have been called
    let artifact_spy = spyOn(component['label'], 'getArtifacts').and.returnValue(artifacts);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['labellingDataService'], 'postSoftDelete').and.throwError("Test error");
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.postSoftDelete();

    // Checks whether the function works properly
    expect(artifact_spy).toHaveBeenCalled();
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    expect(delete_spy).toHaveBeenCalledWith({'p_id': 1, 'l_id': 3})
    expect(navigate_spy).not.toHaveBeenCalledWith(['project', 1, 'labelmanagement'])
    expect(toast_spy).toHaveBeenCalledWith([false, "Something went wrong!"])
  });

  // Test if the postSoftDelete does nothing when the confirm modal returns false
  it('should do nothing if cancelled', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(false);
    // List of hardcoded themes
    let artifacts: StringArtifact[] = [];
    // Set the project id 
    component.p_id = 1;
    // Set the label id
    component.label_id = 3;

    // Spy on the functions that should have been called
    let artifact_spy = spyOn(component['label'], 'getArtifacts').and.returnValue(artifacts);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['labellingDataService'], 'postSoftDelete');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.postSoftDelete();

    // Checks whether the function works properly
    expect(artifact_spy).toHaveBeenCalled();
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    expect(delete_spy).not.toHaveBeenCalled();
    expect(navigate_spy).not.toHaveBeenCalledWith(['project', 1, 'labelmanagement'])
    expect(toast_spy).not.toHaveBeenCalledWith([false, "Something went wrong!"])
  });

  // Test if the postSoftDelete return a failure toast when the label is used
  it('should do nothing if cancelled', async () => {
    // List of hardcoded themes
    let artifacts: StringArtifact[] = [new StringArtifact(1, 'IDENT', "Something")];
    // Set the project id 
    component.p_id = 1;
    // Set the label id
    component.label_id = 3;

    // Spy on the functions that should have been called
    let artifact_spy = spyOn(component['label'], 'getArtifacts').and.returnValue(artifacts);
    let modal_spy = spyOn(component['modalService'], 'open')
    let delete_spy = spyOn(component['labellingDataService'], 'postSoftDelete');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.postSoftDelete();

    // Checks whether the function works properly
    expect(artifact_spy).toHaveBeenCalled();
    expect(modal_spy).not.toHaveBeenCalled();
    expect(delete_spy).not.toHaveBeenCalled();
    expect(navigate_spy).not.toHaveBeenCalledWith(['project', 1, 'labelmanagement'])
    expect(toast_spy).toHaveBeenCalledWith([false, "This label has been already used, so it cannot be deleted"])
  });

  // Test if the openEdit function works correctly
  it('should open the edit label modal, get the label and reinitialize the pae', async () => {
    // Set the label
    let label = new Label(1, "Label", "Description", "Type");
    component.label = label;
    
    // Instance of NgbModalRef
    modalRef = modalService.open(LabelFormComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on ngOnInit and stub the call
    let init_spy = spyOn(component, 'ngOnInit');

    // Call the openEdit function
    component.openEdit();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(LabelFormComponent, { size: 'xl' });
    // Check if modalRef.componentInstance.label was set with the right value
    expect(modalRef.componentInstance.label).toEqual(label);
    // Check if ngOnInit is called
    expect(init_spy).toHaveBeenCalled();
  });

  // Test if the openLabelHistory function works correctly
  it('should open the label history modal', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(HistoryComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)

    // Call the openEdit function
    component.openLabelHistory();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(HistoryComponent, { size: 'xl' });
    // Check if modalRef.componentInstance.label was set with the right value
    expect(modalRef.componentInstance.history_type).toEqual("Label");
  });

  // Test the get labelling function
  it('should get the labelling amount on the individual Label management page', async () => {
    // Create spy for getLabellings call
    let spy = spyOn(component['labellingDataService'], "getLabellingCount")
    // Calls the getLabellingAmount function
    await component.getLabellingAmount();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  it('should reroute to a different page', async () => {
    // Create spy router
    let spy = spyOn(component['router'], "navigate");
    component.p_id = 5;
    // Calls function to be tested
    component.reRouter();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalledWith(['/project', 5, 'labelmanagement']);
  });

  it('should reroute to a different theme', async () => {
    // Create spy router
    let spy = spyOn(component['router'], "navigate");
    component.p_id = 5;
    // Calls function to be tested
    component.reRouterTheme(8);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalledWith(['/project', 5, 'singleTheme', 8]);
  });

});
