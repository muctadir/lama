import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactManagementPageComponent } from './artifact-management-page.component';

describe('ArtifactManagementPageComponent', () => {
  let component: ArtifactManagementPageComponent;
  let fixture: ComponentFixture<ArtifactManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtifactManagementPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
