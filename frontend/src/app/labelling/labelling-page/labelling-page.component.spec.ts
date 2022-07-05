import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { StringArtifact } from 'app/classes/stringartifact';
import { User } from 'app/classes/user';
import { LabellingPageComponent } from './labelling-page.component';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';

/**
 * Testing suite for the labelling page
 */
describe('LabellingPageComponent', () => {
  let component: LabellingPageComponent;
  let fixture: ComponentFixture<LabellingPageComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  // Adds router dependency
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabellingPageComponent],
      imports: [RouterTestingModule],
      providers: [NgbActiveModal, FormBuilder]
    })
      .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabellingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component gets created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize when frozen', async () => {
    // Creates the spies
    let spy = spyOn(component["projectDataService"], "getFrozen").and.returnValue(Promise.resolve(true));
    let spyRouter = spyOn(component["router"], "navigate");
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Sets the project id, needed for testing
    component.p_id = 1;

    // Calls function to be tested
    await component.ngOnInit();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/project', 1]);
    expect(spyToast).toHaveBeenCalledWith([false, "Project frozen, you can not label"]);
  });

  it('should initialize when not frozen', async () => {
    // Creates the spy to not be frozen
    let spy = spyOn(component["projectDataService"], "getFrozen").and.returnValue(Promise.resolve(false));
    // Creates spies for function calls
    let spy2 = spyOn(component.eventEmitter, "emit");
    let spy3 = spyOn(component, "loadPageContent");

    // Calls function to be tested
    await component.ngOnInit();

    // Checks the function calls
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    // Checks the variables
    expect(component.hidden).toBe(true);
    expect(component.startTime).toBeDefined();
  });

  it('should tests loadPageContent when there is invalid input', async () => {
    // Creates the spies
    let spy = spyOn(component["routeService"], "checkLabellingId").and.returnValue(false);
    let spy2 = spyOn(component, "getRandomArtifact").and.returnValue(Promise.resolve(false));

    // calls the function
    await component.loadPageContent();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should loadPageContent when there is valid input', async () => {
    // Sets current url
    component.url = "/project/3/labelling/5";
    component.p_id = 3;
    // Sets people who have labelled already
    component.labellers = [new User(2, "user2"), new User(1, "user1")];

    // Creates the spies
    let spy = spyOn(component["routeService"], "checkLabellingId").and.returnValue(true);
    let spy2 = spyOn(component, "getNonRandomArtifact");
    let spy3 = spyOn(component, "getLabelTypesWithLabels");
    let spy4 = spyOn(component["accountService"], "userData").and.returnValue(Promise.resolve(new User(1, "user1")));
    let spy5 = spyOn(component["router"], "navigate");
    let spy6 = spyOn(component["toastCommService"], "emitChange");
    let spy7 = spyOn(component["routeService"], "getThemeID").and.returnValue("5");

    // calls the function
    await component.loadPageContent();

    // Checks the result
    expect(spy).toHaveBeenCalledWith("/project/3/labelling/5");
    expect(spy2).toHaveBeenCalledWith(5);
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalledWith(['/project', 3, 'singleartifact', "5"]);
    expect(spy6).toHaveBeenCalledWith([false, "You have already labelled this artifact"]);
    expect(spy7).toHaveBeenCalled();
  });

  it('should get non random artifact without an error', async () => {
    // Artifact to return
    let output = { "result": new StringArtifact(3, "abc", "a long text") }

    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getArtifact").and.returnValue(Promise.resolve(output));
    let spy2 = spyOn(component, "getLabellersGen");

    // calls the function
    await component.getNonRandomArtifact(1);

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.artifact).toEqual(new StringArtifact(3, "abc", "a long text"));
  });

  it('should get a non random artifact with an error', async () => {
    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getArtifact").and.throwError(new Error("test"));
    let spy2 = spyOn(component, "getLabellersGen");
    let spy3 = spyOn(component["router"], "navigate");
    let spy4 = spyOn(component["toastCommService"], "emitChange");

    // calls the function
    await component.getNonRandomArtifact(1);

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalledWith([false, "Invalid request"]);
  });

  it('should get a random artifact without error', async () => {
    // Artifact to return
    let output = new StringArtifact(3, "abc", "a long text");

    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getRandomArtifact").and.returnValue(Promise.resolve(output));
    let spy2 = spyOn(component, "getLabellersGen");

    // calls the function
    let final = await component.getRandomArtifact();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    // Checks return value
    expect(final).toBeTruthy();
  });

  it('should get a random artifact with error case 1', async () => {
    // Sets component basic values
    component.p_id = 3;

    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getRandomArtifact").and.throwError(new Error("a"));
    let spy2 = spyOn(component["router"], "navigate");
    let spy3 = spyOn(component["toastCommService"], "emitChange");

    // calls the function
    let final = await component.getRandomArtifact();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(['/project', 3]);
    expect(spy3).toHaveBeenCalledWith([false, "There are no artifacts to label."]);
    // Checks return value
    expect(final).toBeFalsy();
  });

  it('should get a random artifact with error case 2', async () => {
    // Sets component basic values
    component.p_id = 3;
    component.artifact = new StringArtifact(3, "abc", "a long text");

    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getRandomArtifact").and.throwError(new Error("a"));
    let spy2 = spyOn(component["router"], "navigate");
    let spy3 = spyOn(component["toastCommService"], "emitChange");

    // calls the function
    let final = await component.getRandomArtifact();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(['/project', 3]);
    expect(spy3).toHaveBeenCalledWith([false, "There are no artifacts left to label!"]);
    // Checks return value
    expect(final).toBeFalsy();
  });

  it('should get the labellers without an error', async () => {
    let labellers = ["one", "two", "test"];
    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getLabellers").and.returnValue(Promise.resolve(labellers));

    // calls the function
    await component.getLabellersGen();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(component.labellers).toEqual(labellers);
  });

  it('should get the labellers with an error', async () => {
    // Sets variables
    component.p_id = 5;

    // Creates the spies
    let spy = spyOn(component["artifactDataService"], "getLabellers").and.throwError(new Error("test"));
    let spy2 = spyOn(component["router"], "navigate");
    let spy3 = spyOn(component["toastCommService"], "emitChange");

    // calls the function
    await component.getLabellersGen();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(['/project', 5]);
    expect(spy3).toHaveBeenCalledWith([false, "Something went wrong. Please try again!"]);
  });

  it('should get label types with labels with no errors', async () => {
    let input = [new LabelType(1, "labeltype1", [new Label(1, "l1", "d1", "1"), new Label(2, "l2", "d2", "1")]),
    new LabelType(2, "labeltype2", [new Label(3, "l3", "d3", "2"), new Label(4, "l4", "d4", "2")])];
    // Creates the spies
    let spy = spyOn(component["labellingDataService"], "getLabelTypesWithLabels").and.returnValue(Promise.resolve(input));

    // calls the function
    await component.getLabelTypesWithLabels();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(component.labelTypes).toEqual(input);
  });

  it('should get label types with labels with errors', async () => {
    // Sets variables
    component.p_id = 5;

    // Creates the spies
    let spy = spyOn(component["labellingDataService"], "getLabelTypesWithLabels").and.throwError(new Error("test"));
    let spy2 = spyOn(component["router"], "navigate");
    let spy3 = spyOn(component["toastCommService"], "emitChange");

    // calls the function
    await component.getLabelTypesWithLabels();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(['/project', 5]);
    expect(spy3).toHaveBeenCalledWith([false, "Something went wrong. Please try again!"]);
  });

  // Test if the openCreateForm function works correctly
  it('should open the create label modal', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(LabelFormComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on getLabelTypesWithLabels and stub the call
    let label_spy = spyOn(component, 'getLabelTypesWithLabels');

    // Call the openCreateForm function
    component.openCreateForm();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(LabelFormComponent, { size: 'xl' });
    // Check if getLabelTypesWithLabels was called
    expect(label_spy).toHaveBeenCalled();

  });

  it('should skip the current artifact, case 1', async () => {
    // Sets variables
    component.p_id = 5;

    // Creates the spies
    let spy = spyOn(component["routeService"], "checkLabellingId").and.returnValue(true);
    let spy2 = spyOn(component["router"], "navigate");

    // calls the function
    component.skip();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(['/project', 5, 'labelling-page']);
  });

  it('should skip the current artifact, case 2', () => {
    // Creates the spies
    let spy = spyOn(component["routeService"], "checkLabellingId").and.returnValue(false);
    let spy2 = spyOn(component, "ngOnInit");

    // calls the function
    component.skip();

    // Checks the result
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should reroute to the labelling page', () => {
    // Sets a variable
    component.p_id = 3;

    // Creates the spy for the router
    let spy = spyOn(component["router"], "navigate");

    // Calls the function to be tested
    component.reRouter();

    // Does the checks
    expect(spy).toHaveBeenCalledWith(['/project', 3, 'labelling-page']);
  });

  it('should submit the labelling without an error', async () => {
    // Sets variables
    component.p_id = 5;

    // Creates spies for function calls
    let spy = spyOn(component, "createResponse").and.returnValue([1, 2, 3]);
    let spy2 = spyOn(component, "sendSubmission");
    // Create spy for toast
    let spy3 = spyOn(component["toastCommService"], "emitChange");

    // Makes the function call
    component.submit();

    // Does the checks
    expect(component.endTime).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith({ p_id: 5, resultArray: [1, 2, 3] });
    expect(spy3).toHaveBeenCalledWith([true, "Artifact labelled successfully"]);
  });

  it('should submit the labelling with an error', async () => {
    // Creates spies for function calls
    let spy = spyOn(component, "createResponse").and.throwError(new Error("test"));
    // Create spy for toast
    let spy2 = spyOn(component["toastCommService"], "emitChange");

    // Makes the function call
    component.submit();

    // Does the checks 
    expect(component.endTime).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith([false, "Submission invalid"]);
  });

  it('should create a response, case 1', () => {
    // Creates spies for function calls
    let spy = spyOn(component.labellings.controls, "forEach");

    // Makes the function call
    let result = component.createResponse(2);

    // Does the check whether forEach was called
    expect(spy).toHaveBeenCalled();
    // Checks whether return value is defined
    expect(result).toBeDefined();
  });

  it('should create a response, case 2', () => {
    // Creates dummy input
    let lt = new LabelType(1, "lt1", []);
    let label = new Label(1, "label1", "desc1", "lt1");

    // Creates the dummy form using dummy input
    let formBuilder = new FormBuilder();
     let labelForm = formBuilder.group({
      labelType: [lt],
      label: [label],
      remark: ["something"],
    });
    
    // Enters dummy input into component var
    component.labellings = new FormArray([labelForm]);

    // Makes the function call
    let result = component.createResponse(2);

    let expResult = [
      {a_id: -1, 
        label_type: {id: 1, name: "lt1"}, 
        label: {id: 1, name: "label1"}, 
        remark: "something", 
        time: 2}
      ];
    // Checks whether return value is defined
    expect(result).toEqual(expResult);
  });

  it('should create a response with a null form', () => {
    // Creates the dummy form using dummy input
    let formBuilder = new FormBuilder();
     let labelForm = formBuilder.group({
      something: undefined
    });
    
    // Enters dummy input into component var
    component.labellings = new FormArray([labelForm]);

    // Makes the function call
    let result = component.createResponse(2);

    let expResult = [
      {a_id: -1, 
        label_type: {id: undefined, name: undefined}, 
        label: {id: undefined, name: undefined}, 
        remark: undefined, 
        time: 2}
      ];
    // Checks whether return value is defined
    expect(result).toEqual(expResult);
  });

  it('should create a response with a invalid status', () => {
    // Creates the dummy form that will never be valid
    let formBuilder = new FormBuilder();
     let labelForm = formBuilder.group({
      something: ["test", [Validators.required, Validators.minLength(10)]]
    });

    // Enters dummy input into component var
    component.labellings = new FormArray([labelForm]);

    // Makes the function call and stores error
    let error;
    try {
      component.createResponse(2);
    } catch(e) {
      error = e;
    }

    // Checks whether error is correct
    expect(error).toEqual(new Error('Submission invalid'));
  });

  it('should send the submission, no error case 1', async () => {
    // Creates spies for function calls
    let spyLabel = spyOn(component["labellingDataService"], "postLabelling");
    let spyRoute = spyOn(component["routeService"], "checkLabellingId").and.returnValue(true);
    let spyReRoute = spyOn(component, "reRouter");

    // Makes the function call
    await component.sendSubmission(2);

    // Checks do determine whether test passes
    expect(spyLabel).toHaveBeenCalledWith(2);
    expect(spyRoute).toHaveBeenCalled();
    expect(spyReRoute).toHaveBeenCalled();
  });

  it('should send the submission, no error case 2', async () => {
    // Creates spies for function calls
    let spyLabel = spyOn(component["labellingDataService"], "postLabelling");
    let spyRoute = spyOn(component["routeService"], "checkLabellingId").and.returnValue(false);
    let spyInit = spyOn(component, "ngOnInit");

    // Makes the function call
    await component.sendSubmission(2);

    // Checks do determine whether test passes
    expect(spyLabel).toHaveBeenCalledWith(2);
    expect(spyRoute).toHaveBeenCalled();
    expect(spyInit).toHaveBeenCalled();
  });

  it('should send the submission, with error', async () => {
    // Creates spies for function calls
    let spyLabel = spyOn(component["labellingDataService"], "postLabelling").and.throwError(new Error("test"));
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Makes the function call
    await component.sendSubmission(2);

    // Checks do determine whether test passes
    expect(spyLabel).toHaveBeenCalledWith(2);
    expect(spyToast).toHaveBeenCalledWith([false, "Database error while submitting labelling."]);
  });

  it('should select the text where start char > end char', () => {
    // Creates spies for function calls
    // @ts-ignore: Complains about type, but should be fine for test case
    let spyLabel = spyOn(document, "getSelection").and.returnValue({ anchorOffset: 300, focusOffset: 200 });

    // Makes the function call
    component.selectedText();

    // Checks whether function was called
    expect(spyLabel).toHaveBeenCalled();
    // Checks whether variables are correct
    expect(component.selectionStartChar).toBe(200);
    expect(component.selectionEndChar).toBe(300);
    // Checks whether we are indeed in second case
    expect(component.hightlightedText).toBe({ anchorOffset: 300, focusOffset: 200 }.toString());
  });

  it('should select the text where nothing is selected', () => {
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

  it('should select the text and split it', async () => {
    // Sets variables in the component for test case
    component.selectionStartChar = 100;
    component.selectionEndChar = 200;
    // Creates some spies
    spyOn(component, "startPosFixer").and.returnValue(100);
    spyOn(component, "endPosFixer").and.returnValue(200);
    // spy for service
    let spyServ = spyOn(component["artifactDataService"], "postSplit").and.returnValue(Promise.resolve(3));
    let spyToast = spyOn(component["toastCommService"], "emitChange");
    let spyRoute = spyOn(component, "routeToLabel");

    // Calls the function to be tested
    await component.split();

    // Checks the function calls
    expect(spyServ).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Artifact was successfully split into artifact #" + 3]);
    expect(spyRoute).toHaveBeenCalled();
  });

  it('should reroute to the labelling page', async () => {
    // Sets some variables in the component
    component.p_id = 8;

    // Spy for the router
    let spyRouter = spyOn(component["router"], "navigate");
    // Spy for ngOnInit
    let spyInit = spyOn(component, "ngOnInit");

    // Calls function to be tested
    await component.routeToLabel(9);

    // Checks
    expect(spyRouter).toHaveBeenCalledWith(['/project', 8, 'labelling-page', 9]);
    expect(spyInit).toHaveBeenCalled();
  });

  it('should get the start position, case 1', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd");

    // Calls the function to be tested
    let result = component.startPosFixer(2);

    // Tests the results
    expect(result).toBe(3);
  })

  it('should get the start position, case 2', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd");

    // Calls the function to be tested
    let result = component.startPosFixer(0);

    // Tests the results
    expect(result).toBe(0);
  })

  it('should get the start position, case 3', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab abcd");

    // Calls the function to be tested
    let result = component.startPosFixer(5);

    // Tests the results
    expect(result).toBe(2);
  });

  it('should get the end position, case 1', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd de");

    // Calls the function to be tested
    let result = component.endPosFixer(8);

    // Tests the results
    expect(result).toBe(8);
  });

  it('should get the end position, case 2', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cd d ");

    // Calls the function to be tested
    let result = component.endPosFixer(1);

    // Tests the results
    expect(result).toBe(3);
  });

  it('should get the end position, case 3', () => {
    // Sets the artifact
    component.artifact = new StringArtifact(1, "xyz", "ab cdd ");

    // Calls the function to be tested
    let result = component.endPosFixer(3);

    // Tests the results
    expect(result).toBe(2);
  });

});
