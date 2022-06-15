import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { LabelManagementComponent } from './label-management.component';
import { FormBuilder } from '@angular/forms';

describe('LabelManagementComponent', () => {
  let component: LabelManagementComponent;
  let fixture: ComponentFixture<LabelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelManagementComponent ],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbModal dependency
      providers: [NgbModal, FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
