import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EditLabelFormComponent } from './edit-label-form.component';

describe('EditLabelFormComponent', () => {
  let component: EditLabelFormComponent;
  let fixture: ComponentFixture<EditLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLabelFormComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created correctly.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
