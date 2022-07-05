import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  /**
   *  Test environment setup
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  // Checks whether the AppComponent is created correctly
  it('should create the app', () => {
    // Create fixture
    const fixture = TestBed.createComponent(AppComponent);
    // Get component
    const app = fixture.componentInstance;
    // Expect component to be created
    expect(app).toBeTruthy();
  });

});
