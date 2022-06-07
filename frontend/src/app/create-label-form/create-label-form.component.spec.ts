import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from './create-label-form.component';

describe('CreateLabelFormComponent', () => {
  let component: CreateLabelFormComponent;
  let fixture: ComponentFixture<CreateLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLabelFormComponent ],

      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
