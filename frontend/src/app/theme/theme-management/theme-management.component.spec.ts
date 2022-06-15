import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';

import { ThemeManagementComponent } from './theme-management.component';

describe('ThemeManagementComponent', () => {
  let component: ThemeManagementComponent;
  let fixture: ComponentFixture<ThemeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeManagementComponent ],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
