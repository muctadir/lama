import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { NavigationMenuComponent } from './navigation-menu.component';

describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;
  
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMenuComponent ],
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule]
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



});
