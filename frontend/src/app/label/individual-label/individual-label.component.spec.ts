import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IndividualLabelComponent } from './individual-label.component';

describe('IndividualLabelComponent', () => {
  let component: IndividualLabelComponent;
  let fixture: ComponentFixture<IndividualLabelComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualLabelComponent ],
      // Addis RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
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
    await component.getLabel(1,1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get labelling function
  it('Tests the getLabellings function to individual Label management page', async () => {
    // Create spy for getLabellings call
    let spy = spyOn(component['labellingDataService'], "getLabelling")
    // Calls the getLabellings function
    await component.getLabellings(1,1);
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
