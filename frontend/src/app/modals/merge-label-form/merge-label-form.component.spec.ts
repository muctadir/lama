import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MergeLabelFormComponent } from './merge-label-form.component';

describe('MergeLabelFormComponent', () => {
  let component: MergeLabelFormComponent;
  let fixture: ComponentFixture<MergeLabelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeLabelFormComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeLabelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});