import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { LabelManagementComponent } from './label-management.component';
import { FormBuilder } from '@angular/forms';
import { Label } from 'app/classes/label';

describe('LabelManagementComponent', () => {
  let component: LabelManagementComponent;
  let fixture: ComponentFixture<LabelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelManagementComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbModal dependency
      providers: [NgbModal, FormBuilder]
    })
      .compileComponents();
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
