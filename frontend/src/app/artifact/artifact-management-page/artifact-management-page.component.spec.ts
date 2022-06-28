import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ArtifactManagementPageComponent } from './artifact-management-page.component';
import { ArtifactDataService } from 'app/services/artifact-data.service';

describe('ArtifactManagementPageComponent', () => {
  /* Objects to be used in testing */
  // Project id
  let p_id = 1;
  // Artifact id
  let a_id = 1;
  // Current url
  let url = 'project/1/artifactmanagement';

  let component: ArtifactManagementPageComponent;
  let fixture: ComponentFixture<ArtifactManagementPageComponent>;

  // Instantiation of ArtifactDataService
  let artifactDataService: ArtifactDataService;
  // Instantiation of Router
  let router: Router;
  // Instantiation of NgbModal
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtifactManagementPageComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal, FormBuilder]
    })
      .compileComponents();
    // Inject the artifact data service into the component's constructor
    artifactDataService = TestBed.inject(ArtifactDataService);
    // Inject the router into the component's constructor
    router = TestBed.inject(Router);
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)

    // When the url gets requested, return this string
    spyOnProperty(router, 'url', 'get').and
      .returnValue(url)
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

  // Tests if the getArtifacts fuction works correctly
  // it('Tests getArtifacts', async () => {
  //   // When artifactDataService.getArtifacts is called, return artifacts
  //   spyOn(component['artifactDataService'], 'getArtifacts').and
  //     .returnValue(Promise.resolve(artifacts))

  //   // Call the getArtifacts function
  //   await component.getArtifacts(p_id)
  //   // Check that artifactDataService.getArtifacts(p_id) 
  //   // was called with the right p_id
  //   expect(artifactDataService.getArtifacts).toHaveBeenCalledWith(p_id)
  //   // Check that artifacts has the right data
  //   expect(component.artifacts).toEqual(artifacts)
  // })

  // Test if the reRouter function works correctly
  it('Tests reRouter', () => {
    // When routeService.getProjectID gets called, return this string
    spyOn(component['routeService'], 'getProjectID').and.returnValue(p_id.toString());

    // Spy on router.navigate and stub the call
    spyOn(router, 'navigate');

    // Call the reRoute function
    component.reRouter(a_id);

    // Check if routeService.getProjectID is called with the correct parameter
    expect(component['routeService'].getProjectID)
      .toHaveBeenCalledWith(url)
    // Check if reRouter navigates to the labelling page
    expect(router.navigate).toHaveBeenCalledWith(['/project', p_id.toString(), 'singleartifact', a_id]);
  });

  // Test if the open function works correctly
  // it('Tests open', async () => {
  //   // Instance of NgbModalRef
  //   modalRef = modalService.open(AddArtifactComponent);
  //   // When modalService.open gets called, return modalRef
  //   spyOn(component['modalService'], 'open').and.returnValue(modalRef)
  //   // Spy on getArtifacts and stub the call
  //   spyOn(component, 'getArtifacts')

  //   // Call the open function
  //   component.open();
  //   // Close the modalRef
  //   await modalRef.close();

  //   // Check if modalService.open is called with the correct parameters
  //   expect(component['modalService'].open)
  //     .toHaveBeenCalledWith(AddArtifactComponent, { size: 'lg' });
  //   // Check if getArtifacts is called with the correct parameter
  //   expect(component.getArtifacts).toHaveBeenCalledWith(p_id)
  // });

  // Test if the onEnter function works correctly when nothing is searched
  // it('Tests onEnter with no search terms', () => {
  //   // When searchForm.value is called, return an empty string
  //   spyOn(component.searchForm, 'value.').and.returnValue('')

  //   // Spy on getArtifacts and stub the call
  //   spyOn(component, 'getArtifacts')

  //   expect(component.searchForm.value).toHaveBeenCalled()
  //   // Check that getArtifacts is called with the correct parameter
  //   expect(component.getArtifacts).toHaveBeenCalledWith(p_id)
  // });

  // Test if ngOnInit works correctly
  // it('Artifact management page initializes correctly', () => {
  //   // Spy on getArtifacts and stub the call
  //   spyOn(component, 'getArtifacts');

  //   // Call ngOnInit
  //   component.ngOnInit();

  //   // Check that getArtifacts is called with the correct parameter
  //   expect(component.getArtifacts).toHaveBeenCalledWith(p_id);
  // });
});
