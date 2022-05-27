import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLabelFormComponent } from './create-label-form.component';

describe('CreateLabelFormComponent', () => {
  let component: CreateLabelFormComponent;
  let fixture: ComponentFixture<CreateLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLabelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
