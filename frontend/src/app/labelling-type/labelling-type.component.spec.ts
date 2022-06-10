import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabellingTypeComponent } from './labelling-type.component';

describe('LabellingTypeComponent', () => {
  let component: LabellingTypeComponent;
  let fixture: ComponentFixture<LabellingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabellingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabellingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
