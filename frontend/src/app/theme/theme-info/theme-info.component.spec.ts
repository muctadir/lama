import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeInfoComponent } from './theme-info.component';

describe('ThemeInfoComponent', () => {
  let component: ThemeInfoComponent;
  let fixture: ComponentFixture<ThemeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
