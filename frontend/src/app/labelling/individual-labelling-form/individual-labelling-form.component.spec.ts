import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualLabellingForm } from './individual-labelling-form.component';

describe('LabellingTypeComponent', () => {
  let component: IndividualLabellingForm;
  let fixture: ComponentFixture<IndividualLabellingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualLabellingForm ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLabellingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
