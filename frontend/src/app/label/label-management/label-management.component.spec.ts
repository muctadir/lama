import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { LabelManagementComponent } from './label-management.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { Label } from 'app/classes/label';

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
      imports: [RouterTestingModule, ReactiveFormsModule],
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

  it('should start the search', async () => {
    let spy = spyOn(component, "onEnter");

    // Calls the function to be tested
    component.searchClick();

    // Calls the click on the search icon
    let image = document.getElementById("searchBar");
    // @ts-ignore: Given type error, but works fine
    spyOn(image, "getBoundingClientRect").and.returnValue({left: -1000});
    image?.click();

    // Checks the result
    expect(spy).toHaveBeenCalled();
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

  it('should reroute to a new page', async () => {
    // Creates a spy on the router
    let spy = spyOn(component["router"], "navigate");
    component.p_id = 5;

    // Calls function to be tested
    component.reRouter(8);

    // Checks the results
    expect(spy).toHaveBeenCalledWith(['/project', 5, 'singlelabel', 8]);
  });

  it('should get the search text and search through the labels 1', async () => {
    // Creates the spies and sets initial values
    spyOn(component["routeService"], "getProjectID").and.returnValue("5");
    component.searchForm.controls["search_term"].setValue("");
    let spy = spyOn(component, "getLabels");

    // Calls the function to be tested
    component.onEnter();

    // Checks the results
    expect(spy).toHaveBeenCalled();
  });

  // Test the onEnter function
  it('should get the search text and search through the labels 2', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type1");
    component.searchForm.controls["search_term"].setValue("something");

    // creates some spies on the service calls
    spyOn(component["routeService"], "getProjectID").and.returnValue("5");
    let spy = spyOn(component["labellingDataService"], "search").and.returnValue(Promise.resolve(
      [
        {
          "id": 1,
          "name": "label1",
          "description": "desc1",
          "type": "type1"
        },
        {
          "id": 2,
          "name": "label2",
          "description": "desc2",
          "type": "type1"
        },
      ]
    ));

    // Calls the function to be tested
    await component.onEnter();

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(component.labels).toEqual([l1, l2]);
  });

  // Test the onEnter function
  it('should get the labelling count per label', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type1");
    component.labels = [l1, l2]

    // creates some spies on the service calls
    spyOn(component["labellingDataService"], "getLabellingCount").and.returnValue(Promise.resolve("5"));

    // Calls the function to be tested
    await component.getLabelledCount();

    // Checks the results
    expect(component.labelAmount).toEqual({1: "5", 2: "5"});
  });

  it('should sort labels based on name desc', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type2");
    let l3 = new Label(3, "label3", "desc3", "type3");

    component.sortedLabel = 1;
    component.labels = [l2, l1, l3];
    
    // Calls the function to be tested
    component.sortLabel();

    // Checks the results
    expect(component.labels).toEqual([l3, l2, l1]);
    expect(component.sortedLabel).toBe(2);
  });

  it('should sort labels based on name asc', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type2");
    let l3 = new Label(3, "label3", "desc3", "type3");

    component.sortedLabel = 2;
    component.labels = [l2, l1, l3];
    
    // Calls the function to be tested
    component.sortLabel();

    // Checks the results
    expect(component.labels).toEqual([l1, l2, l3]);
    expect(component.sortedLabel).toBe(1);
  });

  it('should sort labels based on type desc', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type2");
    let l3 = new Label(3, "label3", "desc3", "type3");

    component.sortedLabelType = 1;
    component.labels = [l2, l1, l3];
    
    // Calls the function to be tested
    component.sortLabelType();

    // Checks the results
    expect(component.labels).toEqual([l3, l2, l1]);
    expect(component.sortedLabelType).toBe(2);
  });

  it('should sort labels based on type asc', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type2");
    let l3 = new Label(3, "label3", "desc3", "type3");

    component.sortedLabelType = 2;
    component.labels = [l2, l1, l3];
    
    // Calls the function to be tested
    component.sortLabelType();

    // Checks the results
    expect(component.labels).toEqual([l1, l2, l3]);
    expect(component.sortedLabelType).toBe(1);
  });

  it('should sort labels based on # of artifacts desc', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type2");
    let l3 = new Label(3, "label3", "desc3", "type3");

    component.sortedNOA = 1;
    component.labels = [l2, l1, l3];
    component.labelAmount = {1: "1", 2: "2", 3: "3"};
    
    // Calls the function to be tested
    component.sortNumberOfArtifacts();

    // Checks the results
    expect(component.labels).toEqual([l1, l2, l3]);
    expect(component.sortedNOA).toBe(2);
  });

  it('should sort labels based on # of artifacts asc', async () => {
    // Create dummy data
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type2");
    let l3 = new Label(3, "label3", "desc3", "type3");

    component.sortedNOA = 2;
    component.labels = [l2, l1, l3];
    component.labelAmount = {1: "1", 2: "2", 3: "3"};
    
    // Calls the function to be tested
    component.sortNumberOfArtifacts();

    // Checks the results
    expect(component.labels).toEqual([l3, l2, l1]);
    expect(component.sortedNOA).toBe(1);
  });


  // Test the sortLabel function
  it('should tests the sortLabel function', () => {
    // Create spy for get url call
    let spy = spyOn(component['labels'], 'sort');
    // Calls the sortLabel function
    component.sortLabel();
    // Checks whether the function is called
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortLabelType function
  it('should test the sortLabelType function', () => {
    // Create spy for get url call
    let spy = spyOn(component['labels'], 'sort');
    // Calls the sortLabelType function
    component.sortLabelType();
    // Checks whether the function is called
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortNumberOfArtifacts function
  it('should test the sortNumberOfArtifacts function', () => {
    // Create spy for get url call
    let spy = spyOn(component['labels'], 'sort');
    // Calls the sortNumberOfArtifacts function
    component.sortNumberOfArtifacts();
    // Checks whether the function is called
    expect(spy).toHaveBeenCalled();
  });


});
