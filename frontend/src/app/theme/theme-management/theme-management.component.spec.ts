import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ThemeManagementComponent } from './theme-management.component';

describe('ThemeManagementComponent', () => {
  let component: ThemeManagementComponent;
  let fixture: ComponentFixture<ThemeManagementComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThemeManagementComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      providers: [FormBuilder]
    })
      .compileComponents();
    router = TestBed.inject(Router);
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

  // Test the reRouter function
  it('should reroute to the createTheme page', () => {
    // Set p_id in component
    component.p_id = 5;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/' + component.p_id + '/createTheme');
    // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');
    // Calls the changePage function
    component.reRouter("createTheme");
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'createTheme']);
  });

  // Test the reRouterTheme function
  it('should reroute to a single theme page', () => {
    // Set p_id in component
    component.p_id = 5;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/' + component.p_id + '/singleTheme/4');
    // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');
    // Calls the changePage function
    component.reRouterTheme("singleTheme", 4);
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'singleTheme', 4]);
  });

  // Test the ngOnInit function
  it('should call all needed functions on initialization', () => {
    let spy = spyOn(component, "ngOnInit").and.callFake(async () => {
      // Create spy for the functions
      let spy1 = spyOn(component['projectDataService'], 'getFrozen').and.returnValue(Promise.resolve(true));
      let spy2 = spyOn(component, 'getThemes');
      let spy3 = spyOn(component, 'searchClick');
      // Call the functions
      component['projectDataService'].getFrozen();
      component.getThemes();
      component.searchClick();
      // Checks whether the functions are called
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
    });
    // Call ngOnInit
    component.ngOnInit();
    // Check if ngOnInit has been called
    expect(spy).toHaveBeenCalled()
  });

  // Test the getThemes function
  it('should get all themes', async () => {
    // Create spy for get url call
    let spy = spyOn(component['themeDataService'], 'getThemes');
    // Call ngOnInit
    await component.getThemes();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortName function
  it('should sort themes on their names', () => {
    // Create spy for get url call
    let spy = spyOn(component['themes'], 'sort');
    // Call ngOnInit
    component.sortName();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortDesc function
  it('should sort themes on their description', () => {
    // Create spy for get url call
    let spy = spyOn(component['themes'], 'sort');
    // Call ngOnInit
    component.sortDesc();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the sortLabels function
  it('should sort themes on their number of labels', () => {
    // Create spy for get url call
    let spy = spyOn(component['themes'], 'sort');
    // Call ngOnInit
    component.sortLabels();
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the onEnter function
  it('should search for nothing', () => {
    // Create spy for get url call
    let spy = spyOn(component, 'onEnter').and.callFake(async () => {
      // Check getThemes function
      let spy1 = spyOn(component, 'getThemes');
      component.getThemes();
      expect(spy1).toHaveBeenCalled();
    });
    // Call function
    component.onEnter();
    // Check if it was called
    expect(spy).toHaveBeenCalled();
  });

  // Test the onEnter function
  it('should search on given text', () => {
    // Create spy for get url call
    let spy = spyOn(component, 'onEnter').and.callFake(async () => {
      // Check search function
      let spy1 = spyOn(component['themeDataService'], 'search');
      component['themeDataService'].search("Happy", 1);
      expect(spy1).toHaveBeenCalled();
    });
    // Call function
    component.onEnter();
    // Check if it was called
    expect(spy).toHaveBeenCalled();
  });

});
