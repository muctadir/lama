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
      declarations: [ ThemeManagementComponent ],
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
  it('Tests the reRouter function to createTheme page', () => {
    // Set p_id in component
    component.p_id = 5;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/createTheme');
     // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');    
    // Calls the changePage function
    component.reRouter("createTheme");    
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'createTheme']);
  });

  // Test the reRouterTheme function
  it('Tests the reRouter function to a single theme page', () => {
    // Set p_id in component
    component.p_id = 5;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/singleTheme/4');
     // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');        
    // Calls the changePage function
    component.reRouterTheme("singleTheme", 4);    
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'singleTheme', 4]);
  });

  // Test the changePage function
  it('Tests if the get_theme_management_info function is called on initialization', () => {    
    // Create spy for get url call
    let spy = spyOn(component, 'get_theme_management_info');
    // Call ngOnInit
    component.ngOnInit();    
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

});
