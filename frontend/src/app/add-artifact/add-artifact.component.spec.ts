import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AddArtifactComponent } from './add-artifact.component';

describe('AddArtifactComponent', () => {
  let component: AddArtifactComponent;
  let fixture: ComponentFixture<AddArtifactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArtifactComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
