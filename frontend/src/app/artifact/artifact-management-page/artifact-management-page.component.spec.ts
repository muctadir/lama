import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactManagementPageComponent } from './artifact-management-page.component';
import { StringArtifact } from 'app/classes/stringartifact';
import { AddArtifactComponent } from 'app/modals/add-artifact/add-artifact.component';

describe('ArtifactManagementPageComponent', () => {
  /* Objects to be used in testing */
  // List of StringArtifacts
  let artifactss = [
    new StringArtifact(1, 'IDENT', "Some artifact"),
    new StringArtifact(2, 'IDENT', "Another artifact"),
    new StringArtifact(3, 'IDENT', "Here's a third one"),
    new StringArtifact(4, 'IDEN2', "I'm getting a bit bored of this"),
    new StringArtifact(5, 'IDEN2', "Last artifact."),
    new StringArtifact(20, 'IDEN2', 'Ok heres an artifact for a 2nd page'),
    new StringArtifact(35, 'IDEN3', 'Last artifact; for real this time')
  ];

  let component: ArtifactManagementPageComponent;
  let fixture: ComponentFixture<ArtifactManagementPageComponent>;

  // Instantiation of NgbModal
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtifactManagementPageComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule, NgbModule],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal, FormBuilder]
    })
      .compileComponents();
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests if ngOnInit works correctly
  it('should initialize component', async () => {
    // Spy on projectDataService.getFrozen and stub the call
    let spy = spyOn(component["projectDataService"], 'getFrozen');
    // Spy on getArtifacts and stub the call
    let spy2 = spyOn(component, 'getArtifacts');
    // Spy on searchClick and stub the call
    let spy3 = spyOn(component, "searchClick");

    // Call ngOnInit
    await component.ngOnInit();

    // Check that projectDataService.getFrozen is called
    expect(spy).toHaveBeenCalled();
    // Check that getArtifacts is called
    expect(spy2).toHaveBeenCalled();
    // Check that searchClick is called
    expect(spy3).toHaveBeenCalled();
  });

  // Tests searchClick
  it('should search only when magnifying glass is clicked', () => {
    // Spy on the onEnter function and stub the call
    spyOn(component, 'onEnter')
    // Get the magnifying glass object
    const mglass = document.getElementById("searchBar");

    // Call the searchClick function
    component.searchClick();

    // Trigger a click event not on the magnifying glass
    mglass?.dispatchEvent(new MouseEvent('click', { 'clientX': 330 }))
    // Check if the onEnter function is not called
    expect(component.onEnter).not.toHaveBeenCalled();

    // Trigger a click event on the magnifying glass
    mglass?.dispatchEvent(new MouseEvent('click', { 'clientX': 500 }))
    // Check if the onEnter function is called
    expect(component.onEnter).toHaveBeenCalled();
  })

  // Tests if the getArtifacts fuction works correctly 
  it('should get and cache requested artifacts when there is nothing cached', async () => {
    let a1 = new StringArtifact(1, 'IDENT', "Some artifact");

    // When getSeekInfo gets called, return [0, 1]
    spyOn(component, 'getSeekInfo').and.returnValue([0, 0]);
    // When artifactDataService.getArtifacts gets called, return the following:
    let spy = spyOn(component["artifactDataService"], 'getArtifacts').and.returnValue(Promise.resolve([7, 2, [a1]]));

    // Set the current page number to 1
    component.page = 1;
    // Call the getArtifacts function and wait until it's done
    await component.getArtifacts();

    // Check that artifactDataService.getArtifacts(p_id) 
    // was called with the right parameters
    expect(spy).toHaveBeenCalled();
    // Check that nArtifacts has the right data
    expect(component.nArtifacts).toEqual(7)
    // Check that nLabelTypes has the right data
    expect(component.nLabelTypes).toEqual(2)
  })

  it('should return and cache requested artifacts when other artifacts are cached', async () => {
    // Set up the cached artifacts
    component.artifacts = { 1: artifactss.slice(0, 5) };
    // Set the number of artifacts
    component.nArtifacts = 7;
    // When getSeekInfo gets called, return [5, 1]
    spyOn(component, 'getSeekInfo').and.returnValue([5, 1]);
    // When artifactDataService.getArtifacts gets called, return the following:
    let spy = spyOn(component["artifactDataService"], 'getArtifacts').and.returnValue(Promise.resolve([7, 2, artifactss.slice(5, 8)]));
    // Set the current page number to 2
    component.page = 2;

    // Call the getArtifacts function and wait until it's done
    await component.getArtifacts();
    // Check that artifactDataService.getArtifacts(p_id) 
    // was called with the right parameters
    expect(spy).toHaveBeenCalled();


    // Artifacts are cached so call the function again and wait for it to be done
    await component.getArtifacts();
    // Check that artifacts has the right data
    expect(component.artifacts[2]).toEqual(artifactss.slice(5, 8));
  })

  // Tests if getSeekInfo works correctly
  it('should return the right index ', () => {
    // Check that getSeekInfo returns the right values when no artifacts are cached
    expect(component.getSeekInfo(2)).toEqual([0,0])

    // Set the artifacts
    component.artifacts = { 1: artifactss.slice(0, 5), 2: artifactss.slice(5, 8) }

    // Check that getSeekInfo returns the right values
    expect(component.getSeekInfo(1)).toEqual([0, 0])
    expect(component.getSeekInfo(2)).toEqual([5, 1])
  })

  // Test if the reRouter function works correctly
  it('should route the user to the correct single artifact page', () => {
    // When routeService.getProjectID gets called, return this string
    spyOn(component['routeService'], 'getProjectID').and.returnValue("5");

    // Spy on router.navigate and stub the call
    let spyRouter = spyOn(component["router"], 'navigate');

    // Call the reRoute function
    component.reRouter(8);

    // Check if routeService.getProjectID is called with the correct parameter
    expect(component['routeService'].getProjectID).toHaveBeenCalled();
    // Check if reRouter navigates to the labelling page
    expect(spyRouter).toHaveBeenCalledWith(['/project', "5", 'singleartifact', 8]);
  });

  // Test if the open function works correctly
  it('should open the artifact upload modal', async () => {
    // Instance of NgbModalRef
    let modalRef = modalService.open(AddArtifactComponent);
    // When modalService.open gets called, return modalRef
    spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    // Spy on getArtifacts and stub the call
    spyOn(component, 'getArtifacts');
    // Spies on the ngOnInit function
    spyOn(component, "ngOnInit");

    // Call the open function
    component.open();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(component['modalService'].open)
      .toHaveBeenCalledWith(AddArtifactComponent, { size: 'lg' });
    // Check if getArtifacts is called
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  // Test if the onEnter function works correctly when nothing is searched
  it('should call getArtifacts if nothing is searched', async () => {
    // Set searchForm.value to the empty string
    component.searchForm.value.search_term = '';
    // Spy on getArtifacts and stub the call
    spyOn(component, 'getArtifacts')

    // Call the onEnter function
    await component.onEnter()
    // Check that getArtifacts is called
    expect(component.getArtifacts).toHaveBeenCalled();
  });

  // Test if the onEnter function works correctly when something is searched
  it('should return artifacts given by search function', async () => {
    // Set searchForm.value to the some string
    component.searchForm.value.search_term = 'search please';
    // Spy on artifactDataService.search and return some artifacts
    spyOn(component["artifactDataService"], 'search').and
      .returnValue(Promise.resolve([artifactss[0], artifactss[2], artifactss[4]]));

    // Call the onEnter function
    await component.onEnter()
    // Check that nArtifacts is correct
    expect(component.nArtifacts).toEqual(3);
  })

  // Checks that getNumberUsers emits an error toast if needed
  it('should give an error toast and return \'Cannot compute\'', () => {
    // Spy on the toastCommService.emitChange function and stub the call
    spyOn(component['toastCommService'], 'emitChange');

    // nLabelTypes is 0 by default, so calling the function should trigger the toast
    expect(component.getNumberUsers(10)).toEqual("Cannot compute");
    expect(component['toastCommService'].emitChange).toHaveBeenCalled();

    // Set the number of label types
    component.nLabelTypes = 3
    // Check if the function emits the toast
    expect(component.getNumberUsers(10)).toEqual("Cannot compute");
    expect(component['toastCommService'].emitChange).toHaveBeenCalled();
  })

  // Checks that getNumberUsers returns the right value
  it('should return the right value', () => {
    // Set the number of label types
    component.nLabelTypes = 2

    // Call the function and check that it returns the right value
    expect(component.getNumberUsers(10)).toEqual(5);
  })
});
