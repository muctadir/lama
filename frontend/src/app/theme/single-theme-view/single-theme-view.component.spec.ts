import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { StringArtifact } from 'app/classes/stringartifact';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { SingleThemeViewComponent } from './single-theme-view.component';

describe('SingleThemeViewComponent', () => {
  let component: SingleThemeViewComponent;
  let fixture: ComponentFixture<SingleThemeViewComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adding the NgbAccordion dependency, unsure why this needs to be imported for the test case
      declarations: [ SingleThemeViewComponent, NgbAccordion ],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleThemeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test for the creation of the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the ngOnInit function
  it('Tests the ngOnInit function to single theme page', () => {
    // Creates a fake getFrozen function function
    let spy1 = spyOn(component['projectDataService'], "getFrozen").and.callFake(async () => {
      // Check if get_single_theme_info is called
      let spy2 = spyOn(component, "get_single_theme_info");
      component.get_single_theme_info(1, 1);
      expect(spy2).toHaveBeenCalled();
    })
    // Calls ngOnInit
    component.ngOnInit()
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
  });

  // Test the get_single_theme_info function
  it('Tests the get_single_theme_info function to theme single page', async () => {
    // Create spy for get url call
    let spy1 = spyOn(component['themeDataService'], "single_theme_info")
    // Create spy for the sort artifacts function
    let spy2 = spyOn(component, "sortArtifacts")
    // Calls the get_single_theme_info function
    await component.get_single_theme_info(1,1);
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Test the sortArtifacts function
  it('Tests the sortArtifacts function to theme single page', async () => {
    // Creates dummy input
    let theme = new Theme(1, "theme1", "tdesc1");
    let l1 = new Label(1, "label1", "ldesc1", "lt1");
    let a1 = new StringArtifact(1, "a", "data1");
    let a2 = new StringArtifact(2, "b", "data2");

    // Sets the dummy input 
    l1.setArtifacts([a2, a1]);
    theme.setLabels([l1]);

    // sets dummy input in component
    component.theme = theme;

    // Calls function to be tested
    component.sortArtifacts();

    // Checks results
    expect(l1.getArtifacts()).toEqual([a1, a2]);
  });
  
  // Test the reRouter function
  it('Tests the reRouter function from theme single page', () => {
    // Set p_id and t_id in component
    component.p_id = 5;
    component.t_id = 1;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/singleTheme'+component.t_id);
     // Create spy on the router.navigate function
    spyOn(router, 'navigate');
    // Calls the reRouter function
    component.reRouter();
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'thememanagement']);
  });

  // Test the reRouterTheme function
  it('Tests the reRouterTheme function from theme single page', async () => {
    // Variable for new theme id
    let newThemeId = 2;
    // Set p_id and t_id in component
    component.p_id = 5;
    component.t_id = 1;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/singleTheme'+component.t_id);
    // Create spy on the router.navigate function
    let spy1 = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    // Create spy on the get_single_theme_info function
    let spy2 = spyOn(component, 'get_single_theme_info');
    // Calls the reRouterTheme function
    await component.reRouterTheme(newThemeId);
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalledWith(['/project', component.p_id, 'singleTheme', newThemeId]);
    expect(spy2).toHaveBeenCalled();
  });

  // Test the reRouterEdit function
  it('Tests the reRouterEdit function from theme single page', () => {
    // Set p_id and t_id in component
    component.p_id = 5;
    component.t_id = 1;
    // Get a value from the router
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/singleTheme'+component.t_id);
    // Create spy on the router.navigate function
    let spy1 = spyOn(router, 'navigate');
    // Calls the reRouterEdit function
    component.reRouterEdit();
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalledWith(['/project', component.p_id, 'editTheme', component.t_id]);
  });

  it('should get the parent name from the theme', () => {
    // Creates dummy input
    let theme = new Theme(1, "theme1", "desc1");
    let ptheme = new Theme(2, "theme2", "desc2");
    theme.setParent(ptheme);
    component.theme = theme;

    // Calls the getParentName function
    let result = component.getParentName();

    // Checks the results
    expect(result).toEqual("theme2");
  });

  it('should get the parent name from the theme, but parent is undefined', () => {
    // Creates dummy input
    let theme = new Theme(1, "theme1", "desc1");
    component.theme = theme;

    // Calls the getParentName function
    let result = component.getParentName();

    // Checks the results
    expect(result).toEqual("");
  });

  // Test the goToTheme function
  it('Tests the goToTheme function from theme single page', () => {
    // Create a theme
    let theme = new Theme(1, "Theme 1", "Description 1");
    // Create spy on the reRouterTheme function
    let spy1 = spyOn(component, 'reRouterTheme');
    // Calls the goToTheme function
    component.goToTheme(theme);
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
  });

  // Test the deleteTheme function
  it('Tests the deleteTheme function', () => {
    // Spy on the functions that should have been called
    let spy1 = spyOn(component['theme'], 'getChildren');
    let spy2 = spyOn(component['theme'], 'getLabels');
    // Calls the goToTheme function
    component.deleteTheme();
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should return all unique artifacts of a label', () => {
    // Creates dummy input
    let l1 = new Label(1, "label1", "ldesc1", "lt1");
    let a1 = new StringArtifact(1, "a", "data1");
    let a2 = new StringArtifact(2, "b", "data2");

    // Sets the dummy input 
    l1.setArtifacts([a2, a1, a2]);

    // Calls function to be tested
    let result = component.getNonDoubleArtifacts(l1);

    // Checks results
    expect(result).toEqual([a2, a1]);
  });

  it('should return an empty array', () => {
    // Creates dummy input
    let l1 = new Label(1, "label1", "ldesc1", "lt1");

    // Calls function to be tested
    let result = component.getNonDoubleArtifacts(l1);

    // Checks results
    expect(result).toEqual([]);
  });

});
