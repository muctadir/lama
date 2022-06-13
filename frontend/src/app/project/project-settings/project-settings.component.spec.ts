import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { ProjectSettingsComponent } from './project-settings.component';
import { FormBuilder } from '@angular/forms';

describe('ProjectSettingsComponent', () => {
  let component: ProjectSettingsComponent;
  let fixture: ComponentFixture<ProjectSettingsComponent>;

  // Instantiation of Router
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSettingsComponent],
      imports: [RouterTestingModule],
      providers: [FormBuilder]
    })
      .compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
