import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { IndividualLabellingForm } from './individual-labelling-form.component';

/**
 * Testing suite for individual labelling form component
 */
describe('IndivdualLabellingComponent', () => {
  let component: IndividualLabellingForm;
  let fixture: ComponentFixture<IndividualLabellingForm>;

  // Sets dependencies
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualLabellingForm],
      imports: [RouterTestingModule, ReactiveFormsModule, NgbTypeaheadModule, FormsModule],
      providers: [FormBuilder]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLabellingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component gets created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', async () => {
    // Creates the various spies
    let spy = spyOn(component, "getLabels");
    let spyForm = spyOn(component.labelForm, "reset");
    let spyForm2 = spyOn(component.labelForm.controls['labelType'], "patchValue");

    // Sets dummy input that is valid
    component.labelType = new LabelType(1, "test", []);
    component.parentForm = new FormArray([]);

    // Calls function to be tested
    await component.ngOnInit();

    // Checks whether correct functions are called
    expect(spy).toHaveBeenCalled();
    expect(spyForm).toHaveBeenCalled();
    expect(spyForm2).toHaveBeenCalled();
  });

  it('should initialize when there is an invalid input, case 1', async () => {
    // Creates the spies
    let spy = spyOn(component, "getLabels");
    let spyForm = spyOn(component.labelForm, "reset");
    let spyForm2 = spyOn(component.labelForm.controls['labelType'], "patchValue");

    // Sets invalid dummy input
    component.labelType = undefined;
    component.parentForm = new FormArray([]);

    // Calls function to be tested
    await component.ngOnInit();

    // Checks the assignment due to invalid input
    expect(component.selectedDesc).toEqual('Something went wrong while getting the labels.');

    // Checks whether correct functions are called
    expect(spy).toHaveBeenCalled();
    expect(spyForm).toHaveBeenCalled();
    expect(spyForm2).toHaveBeenCalled();
  });

  it('should initialize when there is an invalid input, case 2', async () => {
    // Creates the spies
    let spy = spyOn(component, "getLabels");
    let spyForm = spyOn(component.labelForm, "reset");
    let spyForm2 = spyOn(component.labelForm.controls['labelType'], "patchValue");

    // Sets invalid dummy input
    component.labelType = new LabelType(1, "test", []);
    component.parentForm = undefined;

    // Calls function to be tested
    await component.ngOnInit();

    // Checks the assignment due to invalid input
    expect(component.selectedDesc).toEqual('Something went wrong while preparing the form.');

    // Checks whether correct functions are called
    expect(spy).toHaveBeenCalled();
    expect(spyForm).toHaveBeenCalled();
    expect(spyForm2).toHaveBeenCalled();
  });

  it('should click the label', () => {
    // Creates dummy imput
    component.labels = [new Label(1, "label1", "desc1", "type1"), new Label(2, "label2", "desc2", "type2")];
    // Dummy input which will used in the function call
    let item = { item: "label2" };
    // Creates a spy 
    let spy = spyOn(component.labelForm.controls['label'], "setValue");

    // Calls the function to test
    component.clickLabel(item);

    // Checks whether the spy gets called correctly
    expect(spy).toHaveBeenCalledWith(new Label(2, "label2", "desc2", "type2"));
    // Checks whether the desc is correct
    expect(component.selectedDesc).toBe("desc2");
  });

  it('should get the labels', async () => {
    // Creates the spies necessary to test the component
    let spyRouter = spyOnProperty(component["router"], "url", "get");
    // Return dummy data
    let spyReRouting = spyOn(component["reroutingService"], "getProjectID").and.returnValue("5");
    let spyLabel = spyOn(component["labelDataService"], "getLabelTypesWithLabels").and.returnValue(
      Promise.resolve([new LabelType(1, "labeltype1", [new Label(1, "l1", "d1", "1"), new Label(2, "l2", "d2", "1")]),
      new LabelType(2, "labeltype2", [new Label(3, "l3", "d3", "2"), new Label(4, "l4", "d4", "2")])]
      )
    );

    // Sets value necessary for test
    component.labelType = new LabelType(1, "test", []);

    // calls function to be tested
    await component.getLabels();

    // Basic checks
    expect(spyRouter).toHaveBeenCalled();
    expect(spyReRouting).toHaveBeenCalled();
    expect(spyLabel).toHaveBeenCalledWith(5);

    // Advanced checks
    expect(component.labels).toEqual([new Label(1, "l1", "d1", "1"), new Label(2, "l2", "d2", "1")]);
    expect(component.allLabelsNames).toEqual(["l1", "l2"]);
  });


  it('should test the labelForm listener', async () => {
    // Creates a spy
    spyOn(component, "getLabels");
    
    // Calls function to create listener
    await component.ngOnInit();

    // Creates the dummy input
    let label = new Label(1, "label1", "desc1", "type1");
    let labeltype = new LabelType(1, "lt1", [label]);
    component.labelType = labeltype;

    // Triggers listener
    component["labelForm"].controls["label"].setValue(label);

    expect(component.selectedDesc).toEqual("desc1");
  });

  it('should test the labelForm listener with null inputs', async () => {
    // Creates a spy
    spyOn(component, "getLabels");

    // Calls function to create listener
    await component.ngOnInit();

    // Creates the dummy input
    let label = new Label(1, "label1", "desc1", "type1");
    component.labelType = undefined;

    // Triggers listener
    component["labelForm"].controls["label"].setValue(label);

    // Does the check whether no error occurs
    expect(component).toBeTruthy();
  });

  it('should test the labelForm listener null inputs case 2', async () => {
    // Creates a spy
    spyOn(component, "getLabels");

    // Spies on the get label call
    let spy = spyOn(component["labelForm"], "get").and.returnValue(null);

    // Calls function to create listener
    await component.ngOnInit();

    // Does the check whether no error occurs
    expect(spy).toHaveBeenCalled();
  });

  it('should get the labels, but has null input for labeltype', async () => {
    // Creates the spies necessary to test the component
    let spyRouter = spyOnProperty(component["router"], "url", "get");
    // Return dummy data
    let spyReRouting = spyOn(component["reroutingService"], "getProjectID").and.returnValue("5");
    let spyLabel = spyOn(component["labelDataService"], "getLabelTypesWithLabels").and.returnValue(
      Promise.resolve([new LabelType(1, "labeltype1", [new Label(1, "l1", "d1", "1"), new Label(2, "l2", "d2", "1")]),
        new LabelType(2, "labeltype2", [new Label(3, "l3", "d3", "2"), new Label(4, "l4", "d4", "2")])]
      )
    );

    // Calls function to be tested
    await component.getLabels();

    // Basic checks
    expect(spyRouter).toHaveBeenCalled();
    expect(spyReRouting).toHaveBeenCalled();
    expect(spyLabel).toHaveBeenCalledWith(5);
  });
});
