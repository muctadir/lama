import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtifactComponent } from './add-artifact.component';

describe('AddArtifactComponent', () => {
  let component: AddArtifactComponent;
  let fixture: ComponentFixture<AddArtifactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArtifactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
