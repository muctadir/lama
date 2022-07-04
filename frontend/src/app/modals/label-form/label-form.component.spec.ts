import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LabelFormComponent } from './label-form.component';
import { Label } from 'app/classes/label';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

fdescribe('LabelFormComponent', () => {
  let component: LabelFormComponent;
  let fixture: ComponentFixture<LabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [LabelFormComponent],
      // Adds NgbActiveModal, LabellingDataService and FormBuilder dependencies
      providers: [NgbActiveModal, LabellingDataService, FormBuilder]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the ngOnInit function
  it('should run the ngOnInit function', () => {
    // Create spy for get label
    let spy = spyOn(component, "getLabelTypes")
    // Sets some values
    component.label = new Label(1, "label1", "desc1", "type1");

    // Calls the ngOnInit function
    component.ngOnInit();
    // Checks whether the functions works properly
    expect(spy).toHaveBeenCalled();
    expect(component.labelForm.value.labelName).toEqual("label1");
    expect(component.labelForm.value.labelDescription).toEqual("desc1");
  });

  // Test the get label function
  it('should get label types', async () => {
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "getLabelTypes")
    // Calls the getLabelTypes function
    await component.getLabelTypes();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get label function
  it('should submit patch to server', async () => {
    // Create a label
    let label = new Label(1, "label 1", "label 1 desc", "label type 1");
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "editLabel")
    // Calls the submitPatchToServer function
    await component.submitPatchToServer(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  it('should submit patch to server', async () => {
    // Create a label
    let label = new Label(1, "label 1", "label 1 desc", "label type 1");
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "editLabel").and.throwError(new TestError("test", {data: "test"}));
    // Creates the toast spy
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Calls the submitPatchToServer function
    await component.submitPatchToServer(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "test"])
  });

  // Test the get label function
  it('should submit post to server', async () => {
    // Create a label
    let label = new Label(1, "label 1", "label 1 desc", "label type 1");
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "submitLabel")
    // Calls the submitPostToServer function
    await component.submitPostToServer(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get label function
  it('should submit post to server', async () => {
    // Create a label
    let label = new Label(1, "label 1", "label 1 desc", "label type 1");
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "submitLabel").and.throwError(new TestError("test", {data: "test"}));
    // Creates the toast spy
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    // Calls the submitPostToServer function
    await component.submitPostToServer(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "test"])
  });

  it('should submit the label form patch', async () => {
    // Create a label
    let label = new Label(1, "label1", "desc1", "type1");
    // Create spy for get label call
    let spy = spyOn(component, "constructPatch");
    let spy2 = spyOn(component, "submitPatchToServer");

    component.label = label;

    // Calls the submitPostToServer function
    component.submit();

    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(label);
  });

  it('should submit the label form patch, but error occurs', async () => {
    // Create a label
    let label = new Label(1, "label1", "desc1", "type1");
    // Create spy for get label call
    let spy = spyOn(component, "constructPatch").and.throwError(new Error("test"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    component.label = label;

    // Calls the submitPostToServer function
    component.submit();

    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Invalid Input"]);
  });

  it('should submit the label form post', async () => {
    // Create a label
    let label = new Label(1, "label1", "desc1", "type1");
    // Create spy for get label call
    let spy = spyOn(component, "constructNewLabel").and.returnValue(label);
    let spy2 = spyOn(component, "submitPostToServer");

    // Calls the submitPostToServer function
    component.submit();

    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(label);
  });

  it('should submit the label form post, but error occurs', async () => {
    // Create spy for get label call
    let spy = spyOn(component, "constructNewLabel").and.throwError(new Error("test"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the submitPostToServer function
    component.submit();

    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Invalid Input"]);
  });

  it('should construct new label, case 1', async () => {
    // Calls the submitPostToServer function
    let error;
    try {
      component.constructNewLabel();
    } catch(e) {
      error = e;
    }

    expect(error).toEqual(new Error('Invalid Form'));
  });

  it('should construct new label, case 2', async () => {
    // Set name
    component.labelForm.controls["labelName"].setValue("some name");

    // Calls the submitPostToServer function
    let error;
    try {
      component.constructNewLabel();
    } catch(e) {
      error = e;
    }

    expect(error).toEqual(new Error('Invalid Form'));
  });

  it('should construct new label, case 3', async () => {
    // Set name
    component.labelForm.controls["labelName"].setValue("some name");
    // Set description
    component.labelForm.controls["labelDescription"].setValue("some desc");

    // Calls the submitPostToServer function
    let error;
    try {
      component.constructNewLabel();
    } catch(e) {
      error = e;
    }

    expect(error).toEqual(new Error('Invalid Form'));
  });

  it('should construct new label, case 4', async () => {
    // Set name
    component.labelForm.controls["labelName"].setValue("some name");
    // Set description
    component.labelForm.controls["labelDescription"].setValue("some desc");
    // Set typeId
    component.labelForm.controls["labelTypeId"].setValue("some type");

    // Calls the submitPostToServer function
    let result = component.constructNewLabel();

    // Checks the results
    expect(result).toEqual(new Label(0, "some name", "some desc", ''));
  });

  it('should patch the label case 1', async () => {
    // Sets the label variable
    component.label = undefined;

    // Calls the submitPostToServer function
    let error;
    try {
      component.constructPatch();
    } catch(e) {
      error = e;
    }
    // Checks the results
    expect(error).toEqual(new Error('Patch was attempted to be constructed without a label being supplied')); 
  });

  it('should patch the label case 2', async () => {
    // Sets the label variable
    component.label = new Label(1, "label1", "desc1", "type1");
    component.labelForm.controls["labelName"].setValue("some name");

    // Calls the submitPostToServer function
    let error;
    try {
      component.constructPatch();
    } catch(e) {
      error = e;
    }
    // Checks the results
    expect(error).toEqual(new Error('Invalid form')); 
  });

  it('should patch the label case 3', async () => {
    // Sets the label variable
    component.label = new Label(1, "label1", "desc1", "type1");
    component.labelForm.controls["labelName"].setValue("some name");
    component.labelForm.controls["labelDescription"].setValue("some desc");

    // Calls the submitPostToServer function
    component.constructPatch();
   
    // Checks the results
    expect(component.label).toEqual(new Label(1, "some name", "some desc", "type1")); 
  });

});
