import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ThemeVisualComponent } from './theme-visual.component';

/**
 * Test bed for the theme visual component
 */
describe('ThemeVisualComponent', () => {
  let component: ThemeVisualComponent;
  let fixture: ComponentFixture<ThemeVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeVisualComponent ],
      imports: [RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', async () => {
    // Creates the spies
    let spy = spyOn(component, "getData");
    let spy2 = spyOn(component, "initSvg");

    // Calls the function to be tested
    await component.ngOnInit();

    // Checks whether the correct calls were made
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should get the data', async () => {
    // Creates the spies
    let spy = spyOn(component["themeDataService"], "themeVisData");
    
    // Calls the function to be tested
    await component.getData();

    // Checks whether the correct calls were made
    expect(spy).toHaveBeenCalled();
  });

});
