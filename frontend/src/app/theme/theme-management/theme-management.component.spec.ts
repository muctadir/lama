import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { ThemeManagementComponent } from './theme-management.component';

describe('ThemeManagementComponent', () => {
  let component: ThemeManagementComponent;
  let fixture: ComponentFixture<ThemeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeManagementComponent ],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
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
