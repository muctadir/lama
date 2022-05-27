import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeLabelFormComponent } from './merge-label-form.component';

describe('MergeLabelFormComponent', () => {
  let component: MergeLabelFormComponent;
  let fixture: ComponentFixture<MergeLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeLabelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
