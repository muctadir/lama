import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabelFormComponent } from './edit-label-form.component';

describe('EditLabelFormComponent', () => {
  let component: EditLabelFormComponent;
  let fixture: ComponentFixture<EditLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLabelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
