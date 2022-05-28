import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeManagementComponent } from './theme-management.component';

describe('ThemeManagementComponent', () => {
  let component: ThemeManagementComponent;
  let fixture: ComponentFixture<ThemeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
