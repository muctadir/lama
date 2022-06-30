import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { FormBuilder } from '@angular/forms';
import { LabelFormComponent } from './label-form.component';
import { Label } from 'app/classes/label';

describe('LabelFormComponent', () => {
  let component: LabelFormComponent;
  let fixture: ComponentFixture<LabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds RouterTestingModule dependency
      imports: [RouterTestingModule],
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
    // Calls the ngOnInit function
    component.ngOnInit();
    // Checks whether the functions works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get label function
  it('should get label types', async () => {
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "getLabelTypes")
    // Calls the get_single_theme_info function
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
    // Calls the get_single_theme_info function
    await component.submitPatchToServer(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get label function
  it('should submit post to server', async () => {
    // Create a label
    let label = new Label(1, "label 1", "label 1 desc", "label type 1");
    // Create spy for get label call
    let spy = spyOn(component['labellingDataService'], "submitLabel")
    // Calls the get_single_theme_info function
    await component.submitPostToServer(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });
});
