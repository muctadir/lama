import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/services/labeling-data.service';
import { FormBuilder } from '@angular/forms';
import { LabelFormComponent } from './label-form.component';

describe('LabelFormComponent', () => {
  let component: LabelFormComponent;
  let fixture: ComponentFixture<LabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds RouterTestingModule dependency
      imports: [RouterTestingModule],
      declarations: [ LabelFormComponent ],
      // Adds NgbActiveModal, LabelingDataService and FormBuilder dependencies
      providers: [NgbActiveModal, LabelingDataService, FormBuilder]
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
});
