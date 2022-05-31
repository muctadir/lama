import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualLabelComponent } from './individual-label.component';

describe('IndividualLabelComponent', () => {
  let component: IndividualLabelComponent;
  let fixture: ComponentFixture<IndividualLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
