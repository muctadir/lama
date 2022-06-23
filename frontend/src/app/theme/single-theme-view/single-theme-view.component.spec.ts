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
    // Create spy for get url call
    let spy = spyOn(component, "get_single_theme_info")
    // Calls the ngOnInit function
    component.ngOnInit();
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
  });

  // Test the get_single_theme_info function
  it('Tests the get_single_theme_info function to theme single page', async () => {
    // Create spy for get url call
    let spy = spyOn(component['themeDataService'], "single_theme_info")
    // Calls the get_single_theme_info function
    await component.get_single_theme_info(1,1);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
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

  // Test the getParentName function
  it('Tests the getParentName function from theme single page', () => {
    // Create spy on the theme.getParent function
    let spy1 = spyOn(component['theme'], 'getParent');
    // Calls the getParentName function
    component.getParentName();
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
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

  // Test the sortArtifacts function
  it('Tests the sortArtifacts function', () => {
    // Calls the sortArtifacts function and calls a fake
    spyOn(component, "sortArtifacts").and.callFake( () => {
      // Create fake artifacts
      let artifact1 = new StringArtifact(1, "Identifier 1", "Data 1");
      let artifact2 = new StringArtifact(2, "Identifier 2", "Data 2");
      let artifact3 = new StringArtifact(3, "Identifier 3", "Data 3");
      // Make an array of artifacts that is unsorted
      let artifacts = [artifact3, artifact1, artifact2]
      if (artifacts != undefined){
        // Sort the artifacts
        artifacts.sort((a,b) => a.getId() - b.getId());
      }
      // Set the artifacts of the label with the sorted array
      expect(artifacts).toEqual([artifact1, artifact2, artifact3])
    })
  });

  // Test the getNonDoubleArtifacts function
  it('Tests the getNonDoubleArtifacts function', () => {
    // Calls the getNonDoubleArtifacts function and calls a fake
    spyOn(component, "getNonDoubleArtifacts").and.callFake( (label: Label): StringArtifact[] => {
      // Create fake artifact
      let artifact1 = new StringArtifact(1, "Identifier 1", "Data 1");
      // Make an array of artifacts that is unsorted
      let artifacts = [artifact1, artifact1];
      if(artifacts != undefined){
        // Remove the duplicates from the list
        return Array.from(artifacts.reduce((m, t) => m.set(t.getId(), t), new Map()).values());
      }
      // Set the artifacts of the label with the sorted array
      expect(artifacts).toEqual([artifact1]);
      // Return array
      return [];
    })
  });

});
