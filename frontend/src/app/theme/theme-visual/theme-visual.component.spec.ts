import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeVisualComponent } from './theme-visual.component';

describe('ThemeVisualComponent', () => {
  let component: ThemeVisualComponent;
  let fixture: ComponentFixture<ThemeVisualComponent>;

  // Initialize test environement
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThemeVisualComponent]
    })
      .compileComponents();
  });

  // Before each test
  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test for creation of component
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
