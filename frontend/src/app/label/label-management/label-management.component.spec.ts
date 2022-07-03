import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { LabelManagementComponent } from './label-management.component';
import { FormBuilder } from '@angular/forms';
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';

describe('LabelManagementComponent', () => {
  let component: LabelManagementComponent;
  let fixture: ComponentFixture<LabelManagementComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelManagementComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbModal dependency
      providers: [NgbModal, FormBuilder, NgbActiveModal]
    })
      .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the ngOnInit function
  it('should call the ngOnInit function on label management page', () => {
    // Create spy for get labels
    let spy1 = spyOn(component, "getLabels")
    // Create spy for get frozen status
    let spy2 = spyOn(component['projectDataService'], "getFrozen")
    // Calls the ngOnInit function
    component.ngOnInit();
    // Checks whether the functions works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Test if the openMerge function works correctly
  it('should open the merge labels modal and reinitialize the page', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(MergeLabelFormComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on ngOnInit and stub the call
    let init_spy = spyOn(component, 'ngOnInit');

    // Call the openMerge function
    component.openMerge();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(MergeLabelFormComponent, { size: 'xl' });
    // Check if ngOnInit is called
    expect(init_spy).toHaveBeenCalled;
  });

  // Test if the openCreate function works correctly
  it('should open the create label modal and reinitialize the page', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(LabelFormComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on ngOnInit and stub the call
    let init_spy = spyOn(component, 'ngOnInit');

    // Call the openMerge function
    component.openCreate();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(LabelFormComponent, { size: 'xl' });
    // Check if ngOnInit is called
    expect(init_spy).toHaveBeenCalled();
  });

  // Test the get label function
  it('should test getLabels function on Label management page', async () => {
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "getLabels")
    // Calls the getLabels function
    await component.getLabels();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get labelled count function
  // TODO:dont know how to do this
  it('should test getLabelledCount function on Label management page', async () => {
    // // Create two themes
    // let label1 = new Label(1, "", "", "");
    // let label2 = new Label(2, "", "", "");
    // // Create the allSubThemes and set it
    // let labels = [label1, label2];
    // component.labels = labels;
    // // Create spy for function
    // let spy = spyOn(component, "getLabelledCount").and.callThrough();
    // let count = labels.length
    // // Checks whether the function works properly
    // expect(spy).toHaveBeenCalled();
    // expect(count).toEqual(2);
  });

  // Test the sortLabel function
  it('Tests if the sortDesc function', () => {
    // Create spy for get url call
    let spy = spyOn(component['labels'], 'sort');
    // Calls the sortLabel function
    component.sortLabel();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortLabelType function
  it('Tests if the sortDesc function', () => {
    // Create spy for get url call
    let spy = spyOn(component['labels'], 'sort');
    // Calls the sortLabelType function
    component.sortLabelType();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortNumberOfArtifacts function
  it('Tests if the sortDesc function', () => {
    // Create spy for get url call
    let spy = spyOn(component['labels'], 'sort');
    // Calls the sortNumberOfArtifacts function
    component.sortNumberOfArtifacts();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });


});
