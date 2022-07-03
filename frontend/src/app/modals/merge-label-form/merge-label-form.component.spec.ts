import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { MergeLabelFormComponent } from './merge-label-form.component';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

/**
 * Test bed for the merge label component
 */
describe('MergeLabelFormComponent', () => {
  let component: MergeLabelFormComponent;
  let fixture: ComponentFixture<MergeLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [ MergeLabelFormComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component, change happens to the labelType', () => {
    // Creates spy on the getLabels call
    let spy = spyOn(component, "getLabels");

    // Calls function to be tested
    component.ngOnInit();

    // Spy to check subscription call
    let spy2 = spyOn(component["form"].controls["toBeMergedLabels"], "reset");

    // Modifies the form to trigger the subscription function
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // Checks whether the correct calls and changes were made
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.availableLabels).toEqual([label]);
  });

  it('should initialize the component, change happens to the toBeMergedLabels', () => {
    // Creates spy on the getLabels call
    let spy = spyOn(component, "getLabels");

    // Calls function to be tested
    component.ngOnInit();

    // Modifies the form to trigger the subscription function
    let label = new Label(1, "label1", "desc1", "type1");
    let formBuilder = new FormBuilder;
    const labelForm = formBuilder.group({
      label: label,
    });
    component.toBeMergedLabels.push(labelForm);

    // Checks whether the correct calls and changes were made
    expect(spy).toHaveBeenCalled();
    expect(component.used).toEqual([label]);
  });

  it('should initialize the component, case where form is null', () => {
    // Returns that the form is null
    spyOn(component["form"], "get").and.returnValue(null); 
    // Creates spy on the getLabels call
    let spy = spyOn(component, "getLabels");

    // Calls the function to test
    component.ngOnInit();

    // Checks the results
    expect(spy).toHaveBeenCalled();
  });

  it('should get the labels from the backend', async () => {
    // Dummy data for the test
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);

    // Spies on the backend call
    spyOn(component["labellingDataService"], "getLabelTypesWithLabels").and.returnValue(Promise.resolve([lt]));

    // Calls the function to test
    await component.getLabels();

    // Checks the results
    expect(component.labelTypes).toEqual([lt])
  });

  it('should get the labels from the backend, but an error occurs', async () => {
    // Spies on the backend call
    spyOn(component["labellingDataService"], "getLabelTypesWithLabels").and.throwError(new Error("test"));
    // Spies on the toast call
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to test
    await component.getLabels();

    // Checks the results
    expect(spyToast).toHaveBeenCalledWith([false, "Something went wrong when trying to supply the labels"])
  });

  it('should add a label to formGroup', () => {
    // Creates spy for the push function
    let spy = spyOn(component["toBeMergedLabels"], "push");

    // Calls function to be tested
    component.add();

    // Checks whether push function was called
    expect(spy).toHaveBeenCalled();
  });

  it('should remove a label from formGroup', () => {
    // Creates spy for the remove function
    let spy = spyOn(component["toBeMergedLabels"], "removeAt");

    // Calls function to be tested
    component.rem(1);

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should give an error if there are less than 2 labels getting merged', async () => {
    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spyToast).toHaveBeenCalledWith([false, "Plase select two or more labels to merge"]);
  });

  it('should submit the merging of labels', async () => {
    // Create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge").and.returnValue(Promise.resolve("Success"));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // Creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    let spy3 = spyOn(component["activeModal"], "close");

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Labels merged successfully"]);
    expect(spy3).toHaveBeenCalled();
  });

  it('should submit the merging of labels when they are null', async () => {
    // Create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge").and.returnValue(Promise.resolve("Success"));

    // Ensures the code doesn't get stuck on the if statement
    spyOnProperty(component["toBeMergedLabels"], "length", "get").and.returnValue(200);

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Ensures we are testing the null branch for the form
    spyOn(component["form"], "get").and.returnValue(null);

    // Spy on the modal close
    let spy3 = spyOn(component["activeModal"], "close");

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Labels merged successfully"]);
    expect(spy3).toHaveBeenCalled();
  });

  it('should submit the merging of labels, but a bad response message', async () => {
    // Create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge").and.returnValue(Promise.resolve("Something else"));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // Creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Something else"]);
  });

  it('should submit the merging of labels, but error with status 511 occurs', async () => {
    // Create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge")
      .and.throwError(new TestError("test", {status: 511}));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // Creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains a forbidden character: \\ ; , or #"]);
  });

  it('should submit the merging of labels, but error with whitespace error', async () => {
    // Create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge")
      .and.throwError(new TestError("test", {status: 69, data: "Input contains leading or trailing whitespaces"}));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // Creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains leading or trailing whitespaces"]);
  });

  it('should submit the merging of labels, but error with whitespace error', async () => {
    // create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge")
      .and.throwError(new TestError("test", {status: 69, data: "Label name cannot be empty"}));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Label name cannot be empty"]);
  });

  it('should submit the merging of labels, but error with empty label desc error', async () => {
    // create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge")
      .and.throwError(new TestError("test", {status: 69, data: "Label description cannot be empty"}));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Label description cannot be empty"]);
  });

  it('should submit the merging of labels, but error with taken label name error', async () => {
    // create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge")
      .and.throwError(new TestError("test", {status: 69, data: "Label name already exists"}));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Label name already exists."]);
  });

  it('should submit the merging of labels, but error with other error', async () => {
    // create the spy for the backend call
    let spy = spyOn(component["labellingDataService"], "postMerge")
      .and.throwError(new TestError("test", {status: 69, data: "something"}));

    // Creates spy for the remove function
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Adds the labelType
    let label = new Label(1, "label1", "desc1", "type1");
    let lt = new LabelType(1, "lt1", [label]);
    component.form.controls["labelType"].setValue(lt);

    // creates dummy labels
    let label1 = new Label(1, "label1", "desc1", "type1");
    let label2 = new Label(2, "label2", "desc2", "type2");
    // Create the dummy forms for the labels
    let formBuilder = new FormBuilder;
    const labelForm1 = formBuilder.group({
      label: label1,
    });
    const labelForm2 = formBuilder.group({
      label: label2,
    });
    // Pushes the forms to the variable
    component.toBeMergedLabels.push(labelForm1);
    component.toBeMergedLabels.push(labelForm2);

    // Calls function to be tested
    await component.submit();

    // Checks whether remove function was called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Something went wrong while merging"]);
  });
});
