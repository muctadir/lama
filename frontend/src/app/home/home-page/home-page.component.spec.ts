import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to see if the component is created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test to see if the ngOnInit function works correctly
  it('Test for ngOnInit function', () => {
    // Spy on the function that is called
    let spy = spyOn(component, "getProjects");
    // Call the function
    component.ngOnInit();
    // Check if the function works
    expect(spy).toHaveBeenCalled();
  });

  // Test to see if the getProjects function works correctly
  it('Test for getProjects function', async () => {
    // Spy on the function that is called
    let spy = spyOn(component['projectDataService'], "getProjects");
    // Call the function
    await component.getProjects();
    // Check if the function works
    expect(spy).toHaveBeenCalled();
  });

  // Test to see if the openLogout function works correctly
  it('Test for openLogout function', async () => {
    // Spy on the function that is called
    let spy = spyOn(component['modalService'], "open");
    // Call the function
    component.openLogout();
    // Check if the function works
    expect(spy).toHaveBeenCalled();
  });

});
