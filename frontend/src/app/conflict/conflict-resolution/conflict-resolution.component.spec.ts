import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ConflictResolutionComponent } from './conflict-resolution.component';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { Label } from 'app/classes/label';
import { FormBuilder } from '@angular/forms';

describe('ConflictResolutionComponent', () => {
  let component: ConflictResolutionComponent;
  let fixture: ComponentFixture<ConflictResolutionComponent>;
  let router: Router

  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictResolutionComponent ],
      imports: [RouterTestingModule],
      providers: [NgbActiveModal, FormBuilder]
    })
    .compileComponents();
    router = TestBed.inject(Router)
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test if the openCreateForm function works correctly
  it('should open the create label modal', async () => {
    // Put a label in  the cache of labels
    component.labels = [new Label(1, "Some label", "Some description", "Some type")];

    // Instance of NgbModalRef
    modalRef = modalService.open(LabelFormComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)
    // Spy on ngOnInit and stub the call
    let init_spy = spyOn(component, 'ngOnInit');

    // Call the open function
    component.openCreateForm();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open was called with the right parameters
    expect(modal_spy).toHaveBeenCalledWith(LabelFormComponent, { size: 'xl' });
    // Check if the cache of labels is cleared
    expect(component.labels).toEqual([]);
    // Check that the page is reinitialized
    expect(init_spy).toHaveBeenCalled();
  });
});
