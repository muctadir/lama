import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavigationMenuComponent } from './navigation-menu.component';

/**
 * Test suite for the navigation menu
 */
describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;
  let router: Router;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMenuComponent ],
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule],
    })
    .compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Checks ngOnInit', () => {
    // Spies on this.router.url
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/5/stats');
    // Spy on evalURL function
    let spy = spyOn(component, "evalURL");

    // Calls ngOnInit
    component.ngOnInit(); 

    // Checks whether evalURL was called correctly
    expect(spy).toHaveBeenCalledWith("/project/5/stats");
  });

  // Test whether changeSize works correctly
  it('Test whether changeSize works correctly', () => {
    expect(component.collapsed).toBeTruthy();
    component.changeSize();
    expect(component.collapsed).toBeFalsy();
  });

  // Test the changePage function
  it('Tests the changePage function', () => {
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/5/stats');

     // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');
    
    // Calls the changePage function
    component.changePage("thememanagement");
    
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', '5', 'thememanagement']);
  });

  it('case 1 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("stats");
    // Check new state
    expect(component.page).toBe(0);
  });

  it('case 2 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("labelling");
    // Check new state
    expect(component.page).toBe(1);
  });

  it('case 3 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("artifact");
    // Check new state
    expect(component.page).toBe(2);
  });

  it('case 4 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("label");
    // Check new state
    expect(component.page).toBe(3);
  });

  it('case 5 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("theme");
    // Check new state
    expect(component.page).toBe(4);
  });

  it('case 6 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("conflict");
    // Check new state
    expect(component.page).toBe(5);
  });

  it('case 7 of evalURL', () => {
    // Check original state
    expect(component.page).toBe(0);
    // Call function
    component.evalURL("settings");
    // Check new state
    expect(component.page).toBe(6);
  });
});
