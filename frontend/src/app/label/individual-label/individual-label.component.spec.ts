import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IndividualLabelComponent } from './individual-label.component';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { HistoryComponent } from 'app/modals/history/history.component';
import { Label } from 'app/classes/label';
import { FormBuilder } from '@angular/forms';

describe('IndividualLabelComponent', () => {
  let component: IndividualLabelComponent;
  let fixture: ComponentFixture<IndividualLabelComponent>;
  let router: Router;
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
  it('Tests the ngOnInit function to individual label management page', () => {
    // Create spy for get label
    let spy1 = spyOn(component, "getLabel")
    // Create spy for get labellings
    let spy2 = spyOn(component, "getLabellings")
    // Create spy for get labelling amount
    let spy3 = spyOn(component, "getLabellingAmount")
    // Create spy for get frozen status
    let spy4 = spyOn(component['projectDataService'], "getFrozen")
    // Calls the ngOnInit function
    component.ngOnInit();
    // Checks whether the functions works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  // Test the get label function
  it('Tests the getLabel function to individual Label management page', async () => {
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "getLabel")
    // Calls the getLabel function
    await component.getLabel(1, 1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get labelling function
  it('Tests the getLabellings function to individual Label management page', async () => {
    // Create spy for getLabellings call
    let spy = spyOn(component['labellingDataService'], "getLabelling")
    // Calls the getLabellings function
    await component.getLabellings(1, 1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the softDeleteTheme function
  it('Tests the deleteLabel function', () => {
    // Spy on the functions that should have been called
    let spy = spyOn(component['label'], 'getArtifacts');
    // Calls the softDeleteTheme function
    component.postSoftDelete();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
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
  it('Tests the getLabellingAmount function to individual Label management page', async () => {
    // Create spy for getLabellings call
    let spy = spyOn(component['labellingDataService'], "getLabellingCount")
    // Calls the getLabellingAmount function
    await component.getLabellingAmount();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });
});
