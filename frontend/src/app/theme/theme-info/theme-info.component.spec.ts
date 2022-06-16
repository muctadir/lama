import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ThemeInfoComponent } from './theme-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';

describe('ThemeInfoComponent', () => {
  // Initializing variables
  let component: ThemeInfoComponent;
  let fixture: ComponentFixture<ThemeInfoComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule],
      declarations: [ ThemeInfoComponent ],
      // Adds FormBuilder dependency
      providers: [FormBuilder]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test for creating the components
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // REROUTER FUNCTIONS
  // Test the reRouter function when in creation
  it('Tests the reRouter function to theme management page', () => {
    // Set p_id in component
    component.p_id = 5;
    // Make create boolean true
    component.create = true;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/createTheme');
     // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');
    // Calls the changePage function
    component.reRouter();
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'thememanagement']);
  });

  // Test the reRouter function when in edit
  it('Tests the reRouter function to singleTheme page', () => {
    // Set p_id in component
    component.p_id = 5;
    // Set t_id in component
    component.t_id = 1;
    // Make create boolean true
    component.edit = true;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/'+component.p_id+'/editTheme'+component.t_id);
    // Create spy on the router.navigate function, and stubs the call (doesnt do anything)
    spyOn(router, 'navigate');    
    // Calls the changePage function
    component.reRouter();    
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'singleTheme', component.t_id]);
  });

  // HIGHLIGHTED DESCRIPTIONS FUNCTION
  // Test whether the highlighted theme description is correctly set
  it('Tests the displayDescriptionTheme function', () => {
    // Create the description
    let themeDesc = "Description";
    // Create a theme
    let theme = new Theme(1, "Theme 1", themeDesc);
    // Create spy for function
    let spy = spyOn(component, "displayDescriptionTheme").and.callThrough();
    // Call the function
    component.displayDescriptionTheme(theme);
    // Checks whether the function works properly    
    expect(spy).toHaveBeenCalled();
    expect(component.selectedDescriptionTheme).toEqual(themeDesc);
  });

  // Test whether the highlighted label description is correctly set
  it('Tests the displayDescriptionLabel function', () => {
    // Create the description
    let labelDesc = "Description";
    // Create a theme
    let label = new Label(1, "Label 1", labelDesc, "");
    // Create spy for function
    let spy = spyOn(component, "displayDescriptionLabel").and.callThrough();
    // Call the function
    component.displayDescriptionLabel(label);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.selectedDescriptionLabel).toEqual(labelDesc);
  });

  // HIGHLIGHTED THEME/LABEL FUNCTION
  // Test whether the highlighted sub-theme is correctly set
  it('Tests the highlightSubtheme function', () => {
    // Create the description
    let themeName = "Theme 1";
    // Create a theme
    let theme = new Theme(1, themeName, "");
    // Create spy for function
    let spy = spyOn(component, "highlightSubtheme").and.callThrough();
    // Call the function
    component.highlightSubtheme(theme);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.highlightedSubtheme).toEqual(themeName);
  });

  // Test whether the highlighted label is correctly set
  it('Tests the highlightLabel function', () => {
    // Create the description
    let labelName = "Label 1";
    // Create a theme
    let label = new Label(1, labelName, "", "");
    // Create spy for function
    let spy = spyOn(component, "highlightLabel").and.callThrough();
    // Call the function
    component.highlightLabel(label);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.highlightedLabel).toEqual(labelName);
  });

  // SUBTHEME REMOVAL FUNCTION
  // Test whether removing subthemes works for creation
  it('Tests the removeSubtheme function for creation', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    // Create the allSubThemes and set it
    let allSubThemes = [theme1, theme2];
    component.allSubThemes = allSubThemes;
    // Create the addedSubThemes and set it
    let addedSubThemes = [theme1, theme2];
    component.addedSubThemes = addedSubThemes;
    // Set creation boolean
    component.create = true;
    // Create spy for function
    let spy = spyOn(component, "removeSubtheme").and.callThrough();
    // Call the function
    component.removeSubtheme(theme1);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedSubThemes).toEqual([theme2]);
    expect(component.allSubThemes).toEqual(allSubThemes);
  });

  // Test whether removing subthemes works for edit
  it('Tests the removeSubtheme function for edit', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    // Create the allSubThemes and set it
    component.allSubThemes = [];
    // Create the addedSubThemes and set it
    let addedSubThemes = [theme1, theme2];
    component.addedSubThemes = addedSubThemes;
    // Set the edit boolean
    component.edit = true;
    // Create spy for function
    let spy = spyOn(component, "removeSubtheme").and.callThrough();
    // Call the function
    component.removeSubtheme(theme1);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.allSubThemes).toEqual([theme1]);
    expect(component.addedSubThemes).toEqual(addedSubThemes);
  });

  // Test whether removing subthemes works for edit 2
  it('Tests the removeSubtheme function for edit 2', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    let theme3 = new Theme(3, "", "");
    // Create the allSubThemes and set it
    let allSubThemes = [theme3];
    component.allSubThemes = allSubThemes;
    // Create the addedSubThemes and set it
    let addedSubThemes = [theme1, theme2];
    component.addedSubThemes = addedSubThemes;    
    // Set the edit boolean
    component.edit = true;
    // Create spy for function
    let spy = spyOn(component, "removeSubtheme").and.callThrough();
    // Call the function
    component.removeSubtheme(theme1);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.allSubThemes).toEqual([theme3, theme1]);
    expect(component.addedSubThemes).toEqual([theme2]);
  });

  // LABEL REMOVAL FUNCTION
  // Test whether removing labels works for creation
  it('Tests the removeLabel function for creation', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    // Create the allSubThemes and set it
    let allLabels = [label1, label2];
    component.allLabels = allLabels;
    // Create the addedSubThemes and set it
    let addedLabels = [label1, label2];
    component.addedLabels = addedLabels;
    // Set creation boolean
    component.create = true;
    // Create spy for function
    let spy = spyOn(component, "removeLabel").and.callThrough();
    // Call the function
    component.removeLabel(label1);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedLabels).toEqual([label2]);
    expect(component.allLabels).toEqual(allLabels);
  });

  // Test whether removing subthemes works for creation
  it('Tests the removeSubtheme function for creation', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    let label3 = new Label(3, "", "", "");
    // Create the allLabels and set it
    let allLabels = [label1, label2, label3];
    component.allLabels = allLabels;
    // Create the addedLabels and set it
    let addedLabels = [label1, label2];
    component.addedLabels = addedLabels;
    // Set creation boolean
    component.create = true;
    // Create spy for function
    let spy = spyOn(component, "removeLabel").and.callThrough();
    // Call the function
    component.removeLabel(label1);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedLabels).toEqual([label2]);
    expect(component.allLabels).toEqual(allLabels);
  });

  // Test whether removing labels works for edit
  it('Tests the removeLabel function for edit', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    let label3 = new Label(3, "", "", "");
    // Create the allLabels and set it
    let allLabels = [label1, label2, label3];
    component.allLabels = allLabels;
    // Create the addedLabels and set it
    let addedLabels = [label1, label2];
    component.addedLabels = addedLabels;
    // Set creation boolean
    component.edit = true;
    // Create spy for function
    let spy = spyOn(component, "removeLabel").and.callThrough();
    // Call the function
    component.removeLabel(label1);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedLabels).toEqual([label2]);
    expect(component.allLabels).toEqual(allLabels);
  });

  // ADDING SUBTHEMES FUNCTION
  // Test whether adding subthemes works for creation
  it('Tests the addSubtheme function for creation', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    // Create the addedSubThemes and set it
    let addedSubThemes = [theme1];
    component.addedSubThemes = addedSubThemes;
    // Create the addedSubThemes and set it
    let allSubThemes = [theme1, theme2];
    component.allSubThemes = allSubThemes;
    // Set the edit boolean
    component.create = true;
    // Create spy for function
    let spy = spyOn(component, "addSubtheme").and.callThrough();
    // Call the function
    component.addSubtheme(theme2);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedSubThemes).toEqual([theme1, theme2]);
    expect(component.allSubThemes).toEqual(allSubThemes);
  });

  // Test whether adding subthemes works for edit
  it('Tests the addSubtheme function for edit', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    // Create the addedSubThemes and set it
    component.addedSubThemes = []; 
    // Create the addedSubThemes and set it
    let allSubThemes = [theme1, theme2];
    component.allSubThemes = allSubThemes;
    // Set the edit boolean
    component.edit = true;
    // Create spy for function
    let spy = spyOn(component, "addSubtheme").and.callThrough();
    // Call the function
    component.addSubtheme(theme2);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedSubThemes).toEqual([theme2]);
    expect(component.allSubThemes).toEqual(allSubThemes);
  });

  // ADDING LABELS FUNCTION
  // Test whether adding labels works for creation
  it('Tests the addLabel function for creation', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    // Create the allLabels and set it
    let allLabels = [label1, label2];
    component.allLabels = allLabels;
    // Create the addedSubThemes and set it
    let addedLabels = [label1];
    component.addedLabels = addedLabels;
    // Set the edit boolean
    component.create = true;
    // Create spy for function
    let spy = spyOn(component, "addLabel").and.callThrough();
    // Call the function
    component.addLabel(label2);
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedLabels).toEqual([label1, label2]);
    expect(component.allLabels).toEqual(allLabels);
  });

  // Test whether adding labels works for edit
  it('Tests the addLabel function for edit', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    // Create the allLabels and set it
    let allLabels = [label1, label2];
    component.allLabels = allLabels;
    // Create the addedSubThemes and set it
    let addedLabels = [label1];
    component.addedLabels = addedLabels;
    // Set the edit boolean
    component.edit = true;
    // Create spy for function
    let spy = spyOn(component, "addLabel").and.callThrough();
    // Call the function
    component.addLabel(label2);    
    // Checks whether the function works properly
    expect(spy).toHaveBeenCalled();
    expect(component.addedLabels).toEqual([label1, label2]);
    expect(component.allLabels).toEqual(allLabels);
  });

  // NGONINIT FUNCTION
  // Test the ngOnInit function
  it('Tests if the ngOnInit function calls all correct functions', () => {    
    // Spy on getting the themes without parents
    let spy1 = spyOn(component, 'get_themes_without_parents');
    // Spy on getting all labels
    let spy2 = spyOn(component, 'get_labels');
    // Spy on setting the booleans
    let spy3 = spyOn(component, 'setBooleans');
    // Spy on setting the header
    let spy4 = spyOn(component, 'setHeader');
    // Call ngOnInit
    component.ngOnInit();    
    // Checks whether the function is called in ngOnInit
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  // Test the ngOnInit function
  it('Tests if the ngOnInit function calls all correct functions when in edit mode', () => {    
    // Spy on getting the themes without parents
    let spy1 = spyOn(component, 'get_themes_without_parents');
    // Spy on getting all labels
    let spy2 = spyOn(component, 'get_labels');
    // Spy on setting the booleans
    let spy3 = spyOn(component, 'setBooleans');
    // Spy on setting the header
    let spy4 = spyOn(component, 'setHeader');
    // Set the edit variable
    component.edit = true;
    // Spy on setting the single theme info
    let spy5 = spyOn(component, 'get_single_theme_info').and.returnValue(Promise.resolve())
    // Call ngOnInit
    component.ngOnInit();    
    // Checks whether the function is called in ngOnInit
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  // SET BOOLEANS FUNCTION
  // Test the setBooleans function for create
  it('Tests if the setBooleans function sets the create value correctly', () => {
    // Set the component url
    component.url = "/project/3/createTheme";
    // Create spy for function
    let spy = spyOn(component, "setBooleans").and.callThrough();
    // Call the function
    component.setBooleans();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled()
    expect(component.create).toEqual(true);
    expect(component.edit).toEqual(false);
  });

  // Test the setBooleans function for edit
  it('Tests if the setBooleans function sets the edit value correctly', () => {    
    // Set the component url
    component.url = "/project/3/editTheme/1";
    // Create spy for function
    let spy = spyOn(component, "setBooleans").and.callThrough();
    // Call the function
    component.setBooleans();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled()
    expect(component.edit).toEqual(true);
    expect(component.create).toEqual(false);
  });

  // SET HEADER FUNCTION
  // Test the setHeader function for creation
  it('Tests if the setHeader function sets the create value correctly', () => {    
    // Set the component edit
    component.edit = false;
    // Set the component create
    component.create = true;
    // Create spy for function
    let spy = spyOn(component, "setHeader").and.callThrough();
    // Call the function
    component.setHeader();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled()
    expect(component.createEditThemeHeader).toEqual("Create");
  });

  // Test the setHeader function for edit
  it('Tests if the setHeader function sets the edit value correctly', () => {    
    // Set the component edit
    component.edit = true;
    // Set the component create
    component.create = false;
    // Create spy for function
    let spy = spyOn(component, "setHeader").and.callThrough();
    // Call the function
    component.setHeader();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled()
    expect(component.createEditThemeHeader).toEqual("Edit");
  });

  // GET_SINGLE_THEME_INFO FUNCTION
  // Test the get_single_theme_info function
  it('Tests if the get_single_theme_info function calls single_theme_info correctly', () => {  
    let theme1 = new Theme(0, "", "");
    // Spy on the single_theme_info function
    let spy = spyOn(component['themeDataService'], "single_theme_info").and.returnValue(Promise.resolve(theme1));
    // Call the function
    component.get_single_theme_info();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled();
    expect(component.theme).toEqual(theme1);
  });

  // INSERT THEME INFO FUNCTION
  // Test the insertThemeInfo function
  it('Tests if the insertThemeInfo function calls its functions correctly', () => {  
    // Set the theme
    let theme = new Theme(1, "", "");
    component.theme = theme;
    // Spy on the getLabels function of the theme
    let spy1 = spyOn(component['theme'], "getLabels");
    // Spy on the getChildren function of the theme
    let spy2 = spyOn(component['theme'], "getChildren");
    // Spy on the setValue function of the form
    let spy3 = spyOn(component['themeForm'], "setValue");
    // Call the function
    component.insertThemeInfo();
    // Check if function works correctly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  // Test the insertThemeInfo function
  it('Tests if the insertThemeInfo function works correctly', () => {  
    // Create the theme, children, and labels
    let theme = new Theme(1, "Name", "Description");
    let child = new Theme(2, "child", "");
    let label = new Label(1, "", "", "");
    // Set the values
    component.theme = theme;
    component.theme.setChildren([child]);
    component.theme.setLabels([label]);
    // Call the function
    component.insertThemeInfo();
    // Check if function works correctly
    expect(component.addedSubThemes).toEqual([child]);
    expect(component.addedLabels).toEqual([label]);
    expect(component.themeForm.value.name).toEqual("Name");
    expect(component.themeForm.value.description).toEqual("Description");
  });

  // CREATE THEME FUNCTION
  // Test the createTheme function
  it('Tests if the createTheme function calls its functions correctly', async () => {  
    // Make sure the form is not empty
    component.themeForm.setValue({
      "name": "Name",
      "description": "Description"
    })
    // Spy on the post_theme_info function
    let spy1 = spyOn(component, "post_theme_info").and.returnValue(Promise.resolve(""));
    // Spy on the get_themes_without_parents function
    let spy2 = spyOn(component, "get_themes_without_parents").and.returnValue(Promise.resolve());
    // Spy on the reset function of the form
    let spy3 = spyOn(component['themeForm'], "reset");
    // Spy on the reRouter function
    let spy4 = spyOn(component, "reRouter");
    // Call the function
    await component.createTheme();
    // Check if function works correctly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  // GET_THEMES_WITHOUT_PARENTS FUNTION
  // Test the get_themes_without_parents function
  it('Tests if the get_themes_without_parents function calls its functions correctly', async () => {
    // Spy on the themes_without_parents function of the dataservice
    let spy = spyOn(component['themeDataService'], "themes_without_parents").and.returnValue(Promise.resolve([]));
    // Call the function
    await component.get_themes_without_parents(1, 1);
    // Check if function works correctly
    expect(spy).toHaveBeenCalled();
  });

  // GET LABELS FUNCTION
  // Test the get_labels function
  it('Tests if the get_labels function calls its functions correctly', async () => {  
    // Set the component pid
    component.p_id = 1;
    // Spy on the themes_without_parents function of the dataservice
    let spy = spyOn(component['labelDataService'], "getLabels").and.returnValue(Promise.resolve([]));
    // Call the function
    await component.get_labels(component.p_id);
    // Check if function works correctly    
    expect(spy).toHaveBeenCalled();
  });

  // POST_THEME_INFO FUNCTION
  // Test the post_theme_info function for creation
  it('Tests if the post_theme_info function calls its functions correctly for creation', async () => {  
    // Set the create and edit booleans
    component.create = true;
    component.edit = false;
    // Spy on the themes_without_parents function of the dataservice
    let spy = spyOn(component['themeDataService'], "create_theme")
    // Call the function
    await component.post_theme_info({});
    // Check if function works correctly    
    expect(spy).toHaveBeenCalled();
  });

  // Test the post_theme_info function for edit
  it('Tests if the post_theme_info function calls its functions correctly for edit', async () => {  
    // Set the create and edit booleans
    component.create = false;
    component.edit = true;
    // Spy on the themes_without_parents function of the dataservice
    let spy = spyOn(component['themeDataService'], "edit_theme")
    // Call the function
    await component.post_theme_info({});
    // Check if function works correctly    
    expect(spy).toHaveBeenCalled();
  });

});