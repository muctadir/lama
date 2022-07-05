import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ThemeInfoComponent } from './theme-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { Router } from '@angular/router';

describe('ThemeInfoComponent', () => {
  // Initializing variables
  let component: ThemeInfoComponent;
  let fixture: ComponentFixture<ThemeInfoComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [ ThemeInfoComponent ],
      // Adds FormBuilder dependency
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  // Test for creating the components
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // REROUTER FUNCTIONS
  // Test the reRouter function when in creation
  it('should reroute to the theme management page', () => {
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
  it('should reroute to the singleTheme page', () => {
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
  it('should highlight the selected theme description', () => {
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

  it('should initialize when frozen', async () => {
    // Creates the spies
    let spy = spyOn(component["projectDataService"], "getFrozen").and.returnValue(Promise.resolve(true));
    let spyRouter = spyOn(component["router"], "navigate");
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    await component.ngOnInit();

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/project', 0]);
    expect(spyToast).toHaveBeenCalledWith([false, "Project frozen, you cannot create or edit a theme"]);
  });

  // Test whether the highlighted label description is correctly set
  it('should highlight the selected label description', () => {
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
  it('should highlight the selected theme', () => {
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
  it('should highlight the selected label', () => {
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
  it('should remove the theme when in creation mode', () => {
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
  it('should remove the theme when in edit mode', () => {
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
  it('should remove the theme when in edit mode 2', () => {
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
  it('should remove the label when in creation mode', () => {
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

  // Test whether removing labels works for creation
  it('should remove the label when in creation mode 2', () => {
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
  it('should remove the label when in edit mode', () => {
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
  it('should add the theme when in creation mode', () => {
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
  it('should add the theme when in edit mode', () => {
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
  it('should add the label when in creation mode', () => {
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
  it('should add the label when in edit mode', () => {
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
  it('should call all functions on initialization', () => { 
    // Check that project is frozen
    let spy = spyOn(component, "ngOnInit").and.callFake(async () => { 
      let spy0 = spyOn(component['projectDataService'], "getFrozen").and.returnValue(Promise.resolve(false));
      // Check if the project is frozen
      if (await component['projectDataService'].getFrozen()){
        // Spy on the navigate function of the router
        let spy1 = spyOn(component['router'], 'navigate')
        component['router'].navigate(['/project', 1]);      
        expect(spy1).toHaveBeenCalledWith(['/project', 1]);
        // Spy on the toast
        let spy2 = spyOn(component['toastCommService'], 'emitChange');
        component['toastCommService'].emitChange([false, "Project frozen, you cannot create or edit a theme"]);
        expect(spy2).toHaveBeenCalledWith([false, "Project frozen, you cannot create or edit a theme"]);
      }
      // Check if the function had been called
      expect(spy0).toHaveBeenCalled();
    });
    // Call ngOnInit
    component.ngOnInit();    
    // Checks whether the function is called in ngOnInit
    expect(spy).toHaveBeenCalled();
  });

  // Test the ngOnInit function
  it('should call all functions on initialization when in creation mode', () => { 
    // Check that project is frozen
    let spy = spyOn(component, "ngOnInit").and.callFake(async () => { 
      let spy0 = spyOn(component['projectDataService'], "getFrozen").and.returnValue(Promise.resolve(false));
      // Check if the project is frozen
      if (await component['projectDataService'].getFrozen()){
        await component['router'].navigate(['/project', 1]);
        component['toastCommService'].emitChange([false, "Project frozen, you cannot create or edit a theme"]);
        return;
      }
      expect(spy0).toHaveBeenCalled();
      // Spy on setting the booleans and headers
      let spy1 = spyOn(component, 'setBooleansAndHeaders');
      component.setBooleansAndHeaders();      
      expect(spy1).toHaveBeenCalled();
      // Spy on getting the labels
      let spy2 = spyOn(component, 'get_labels');
      component.get_labels(1);
      expect(spy2).toHaveBeenCalledWith(1);
      // Spy on getting the themes
      let spy3 = spyOn(component, "get_themes_without_parents");
      component.get_themes_without_parents(1, 0);
      expect(spy3).toHaveBeenCalledWith(1, 0);
    });    
    // Set creation mode
    component.create = true;
    // Call ngOnInit
    component.ngOnInit();  
    // Chekc if function was called
    expect(spy).toHaveBeenCalled();
  });

  // Test the ngOnInit function
  it('should call all functions on initialization when in edit mode', () => { 
    // Check that project is frozen
    let spy = spyOn(component, "ngOnInit").and.callFake(async () => { 
      let spy0 = spyOn(component['projectDataService'], "getFrozen").and.returnValue(Promise.resolve(false));
      // Check if the project is frozen
      if (await component['projectDataService'].getFrozen()){
        await component['router'].navigate(['/project', 1]);
        component['toastCommService'].emitChange([false, "Project frozen, you cannot create or edit a theme"]);
        return;
      }
      expect(spy0).toHaveBeenCalled(); 
      // Spy on setting the booleans and headers
      let spy1 = spyOn(component, 'setBooleansAndHeaders');
      component.setBooleansAndHeaders();      
      expect(spy1).toHaveBeenCalled();
      // Spy on getting the labels
      let spy3 = spyOn(component, 'get_labels');
      component.get_labels(1);
      expect(spy3).toHaveBeenCalledWith(1);
      // Spy on getting the themes
      let spy4 = spyOn(component, "get_themes_without_parents");
      component.get_themes_without_parents(1, 1);
      expect(spy4).toHaveBeenCalledWith(1, 1);
    });
    // Set the edit variable
    component.edit = true;
    // Call ngOnInit
    component.ngOnInit(); 
    // Chekc if function was called
    expect(spy).toHaveBeenCalled();
  });

  // SET BOOLEANS AND HEADERS FUNCTION
  // Test the setBooleans function for create
  it('should set the create boolean', () => {
    // Set the component url
    component.url = "/project/3/createTheme";
    // Create spy for function
    let spy = spyOn(component, "setBooleansAndHeaders").and.callThrough();
    // Call the function
    component.setBooleansAndHeaders();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled()
    expect(component.create).toEqual(true);
    expect(component.edit).toEqual(false);
  });

  // Test the setBooleans function for edit
  it('should set the edit boolean', () => {    
    // Set the component url
    component.url = "/project/3/editTheme/1";
    // Create spy for function
    let spy = spyOn(component, "setBooleansAndHeaders").and.callThrough();
    // Call the function
    component.setBooleansAndHeaders();
    // Check if function works correctly
    expect(spy).toHaveBeenCalled()
    expect(component.edit).toEqual(true);
    expect(component.create).toEqual(false);
  });

  // GET_SINGLE_THEME_INFO FUNCTION
  // Test the get_single_theme_info function
  it('should get all the single theme info', () => {  
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
  it('should set theme info', () => {  
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
  it('should send theme info', () => {  
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
  it('should create the theme', async () => {  
    // Make sure the form is not empty
    component.themeForm.setValue({
      "name": "Name",
      "description": "Description"
    })
    // Spy on the post_theme_info function
    let spy1 = spyOn(component, "post_theme_info").and.returnValue(Promise.resolve("Theme created"));
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

  it('should initialize in non-edit mode', async () => {
    // Creates the spies
    let spy = spyOn(component, "get_themes_without_parents");
    let spy2 = spyOn(component, "setBooleansAndHeaders");
    let spy3 = spyOn(component, "get_labels");

    // Sets the variable
    component.edit = false

    // Calls function to be tested
    await component.ngOnInit();

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  // GET_THEMES_WITHOUT_PARENTS FUNTION
  // Test the get_themes_without_parents function
  it('should get the themes without parents', async () => {
    // Spy on the themes_without_parents function of the dataservice
    let spy = spyOn(component['themeDataService'], "themes_without_parents").and.returnValue(Promise.resolve([]));
    // Call the function
    await component.get_themes_without_parents(1, 1);
    // Check if function works correctly
    expect(spy).toHaveBeenCalled();
  });

  // GET LABELS FUNCTION
  // Test the get_labels function
  it('should get all labels', async () => {  
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
  it('should post theme info to the backend when in creation mode', async () => {  
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
  it('should post theme info to the backend when in edit mode', async () => {  
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

  it('should initialize in edit mode', async () => {
    // Creates the spies
    let spy = spyOn(component, "get_themes_without_parents");
    let spy2 = spyOn(component, "setBooleansAndHeaders");
    let spy3 = spyOn(component, "get_labels");
    let spy4 = spyOn(component["routeService"], "getThemeID");

    component.edit = true;

    // Calls function to be tested
    await component.ngOnInit();

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should set booleans and headers, for creation', async () => {
    // Sets value
    component.url = "abccreate";

    // Calls function to be tested
    component.setBooleansAndHeaders();

    // Does the checks
    expect(component.edit).toBeFalse();
    expect(component.create).toBeTrue();
    // Does the checks
    expect(component.createEditThemeHeader).toEqual("Create");
  });

  it('should set booleans and headers, for creation', async () => {
    // Sets value
    component.url = "absedit";

    // Calls function to be tested
    component.setBooleansAndHeaders();

    // Does the checks
    expect(component.edit).toBeTrue();
    expect(component.create).toBeFalse();
    // Does the checks
    expect(component.createEditThemeHeader).toEqual("Edit");
  });

  it('should set booleans and headers, case 2', async () => {
    // Sets value
    component.url = "abc";

    // Calls function to be tested
    component.setBooleansAndHeaders();

    // Does the checks
    expect(component.edit).toBeTrue();
    expect(component.create).toBeFalse();
  });

  it('should get single theme info', async () => {
    // create dummy input
    let theme = new Theme(1, "theme1", "desc1");

    // Spies on backend call
    let spy = spyOn(component["themeDataService"], "single_theme_info")
      .and.returnValue(Promise.resolve(theme));

    // Calls function to be tested
    await component.get_single_theme_info();

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(component.theme).toEqual(theme);
  });

  it('should insert theme info', async () => {
    // create dummy input
    let theme = new Theme(1, "theme1", "desc1");
    let l1 = new Label(1, "label1", "desc1", "type1");
    theme.setLabels([l1]);
    let stheme = new Theme(1, "theme2", "desc2");
    theme.setChildren([stheme]);

    // sets variable
    component.theme = theme;

    // Calls function to be tested
    component.insertThemeInfo();

    // Does the checks
    expect(component.addedLabels).toEqual([l1]);
    expect(component.addedSubThemes).toEqual([stheme]);
  });

  it('should create a theme', async () => {
    // Creates a spies
    spyOn(component["service"], "checkFilled").and.returnValue(true);
    let spy = spyOn(component, "post_theme_info").and.returnValue(Promise.resolve("Theme created"));
    let spy2 = spyOn(component, "get_themes_without_parents");
    let spy3 = spyOn(component, "reRouter");

    // Sets variables
    component.create = true;
    component.themeForm.controls["name"].setValue("theme1");
    component.themeForm.controls["description"].setValue("desc1");
    let l1 = new Label(1, "label1", "desc1", "type1");
    component.addedLabels = [l1];
    let stheme = new Theme(1, "theme2", "desc2");
    component.addedSubThemes = [stheme];
    component.p_id = 5;

    // Calls function to be tested
    await component.createTheme();

    let output = {
      "name": "theme1",
      "description": "desc1",
      "labels": [l1],
      "sub_themes": [stheme],
      "p_id": 5
    }
    expect(spy).toHaveBeenCalledWith(output);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should edit a theme', async () => {
    // Creates a spies
    spyOn(component["service"], "checkFilled").and.returnValue(true);
    let spy = spyOn(component, "post_theme_info").and.returnValue(Promise.resolve("Theme edited"));
    let spy2 = spyOn(component, "get_themes_without_parents");
    let spy3 = spyOn(component, "reRouter");

    // Sets variables
    component.create = false;
    let theme = new Theme(1, "theme1", "desc1");
    component.theme = theme;
    component.themeForm.controls["name"].setValue("theme1");
    component.themeForm.controls["description"].setValue("desc1");
    let l1 = new Label(1, "label1", "desc1", "type1");
    component.addedLabels = [l1];
    let stheme = new Theme(1, "theme2", "desc2");
    component.addedSubThemes = [stheme];
    component.p_id = 5;

    // Calls function to be tested
    await component.createTheme();

    let output = {
      "name": "theme1",
      "description": "desc1",
      "labels": [l1],
      "sub_themes": [stheme],
      "p_id": 5
    }
    expect(spy).toHaveBeenCalledWith(output);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should display an error that theme could not be created/edited', async () => {
    // Creates a spies
    spyOn(component["service"], "checkFilled").and.returnValue(false);
    // create spy for toast
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls function to be tested
    await component.createTheme();

    // does the checks
    expect(spyToast).toHaveBeenCalledWith([false, "Name or description not filled in"]);
  });

  it('should get themes without parents', async () => {
    let t = new Theme(1, "theme1", "desc1")

    // create spy for backend call
    let spy = spyOn(component["themeDataService"], "themes_without_parents")
      .and.returnValue(Promise.resolve([t]));

    // Calls function to be tested
    await component.get_themes_without_parents(1, 4);

    // does the checks
    expect(spy).toHaveBeenCalled();
    expect(component.allSubThemes).toEqual([t]);
  });

  it('should get labels', async () => {
    let l = new Label(1, "label1", "desc1", "type1");

    // create spy for backend call
    let spy = spyOn(component["labelDataService"], "getLabels")
      .and.returnValue(Promise.resolve([l]));

    // Calls function to be tested
    await component.get_labels(1);

    // does the checks
    expect(spy).toHaveBeenCalled();
    expect(component.allLabels).toEqual([l]);
  });

  it('should post create theme info', async () => {
    // sets variable
    component.create = true;

    // create spy for backend call
    let spy = spyOn(component["themeDataService"], "create_theme");

    // Calls function to be tested
    await component.post_theme_info(1);

    // does the checks
    expect(spy).toHaveBeenCalled();
  });

  // Test the searchLabel function
  it('should search labels', async () => {  
    // Spy on searchLabel function
    let spy = spyOn(component, "searchLabel").and.callFake(async () => {
      // Get the text of the form
      let text = "Happy";
      // Create new labels
      let label1 = new Label(1, "Happy", "Desc", "Emotion");
      let label2 = new Label(2, "Happy label", "Desc", "Emotion");
      let label3 = new Label(3, "Sad", "Desc", "Emotion");
      // Get all labels
      let allLabels = [label1, label2, label3];
      // Get the array of labels that are included in the search
      let newArray = allLabels.filter(s => s.getName().toLowerCase().includes(text.toLowerCase()));
      // Check if newArray contains what expected
      expect(newArray).toEqual([label1, label2]);
    });
    // Call the function
    component.searchLabel();
    // Check it has been called
    expect(spy).toHaveBeenCalled();
  });

  // Test the searchTheme function
  it('should search themes', async () => {  
    // Spy on searchLabel function
    let spy = spyOn(component, "searchTheme").and.callFake(async () => {
      // Get the text of the form
      let text = "Happy";
      // Create new labels
      let theme1 = new Theme(1, "Happy", "Desc");
      let theme2 = new Theme(2, "Happy theme", "Desc");
      let theme3 = new Theme(3, "Sad", "Desc");
      // Get all labels
      let allSubThemes = [theme1, theme2, theme3];
      // Get the array of labels that are included in the search
      let newArray = allSubThemes.filter(s => s.getName().toLowerCase().includes(text.toLowerCase()));
      // Check if newArray contains what expected
      expect(newArray).toEqual([theme1, theme2]);
    });
    // Call the function
    component.searchTheme();
    // Check it has been called
    expect(spy).toHaveBeenCalled();
  });
  
  it('should post edit theme info', async () => {
    // sets variable
    component.create = false;
    component.edit = true
    
    // create spy for backend call
    let spy = spyOn(component["themeDataService"], "edit_theme");

    // Calls function to be tested
    await component.post_theme_info(1);

    // does the checks
    expect(spy).toHaveBeenCalled();
  });

  it('should post theme info, error case', async () => {
    // sets variable
    component.create = false;
    component.edit = false;

    // Calls function to be tested
    let result = await component.post_theme_info(1);

    // does the checks
    expect(result).toEqual("Error has occured when saving the theme");
  });

  it('should add label', async () => {
    let l1 = new Label(1, "label1", "desc1", "type1");
    component.addedLabels = [l1];
    // Calls function to be tested
    let result = component.addLabel(l1);

    // does the checks
    expect(result).toBeUndefined();
  });

  it('should add label', async () => {
    // creates dummy values
    let l1 = new Label(1, "label1", "desc1", "type1");
    component.addedLabels = [];

    // does initial check
    expect(component.addedLabels).toEqual([]);

    // Calls function to be tested
    component.addLabel(l1);

    // does the checks
    expect(component.addedLabels).toEqual([l1]);
  });

  it('should add subtheme', async () => {
    // Sets dummy values
    let t1 = new Theme(1, "theme1", "desc1");
    component.addedSubThemes = [t1];
    // Calls function to be tested
    let result = component.addSubtheme(t1);

    // does the checks
    expect(result).toBeUndefined();
  });

  it('should add subtheme', async () => {
    // creates dummy values
    let t1 = new Theme(1, "theme1", "desc1");
    component.addedSubThemes = [];

    // does initial check
    expect(component.addedSubThemes).toEqual([]);

    // Calls function to be tested
    component.addSubtheme(t1);

    // does the checks
    expect(component.addedSubThemes).toEqual([t1]);
  });

  it('should remove label', async () => {
    // creates dummy values
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "label2", "desc2", "type1");
    component.addedLabels = [l1, l2];

    // Calls function to be tested
    component.removeLabel(l1);

    // checks results
    expect(component.addedLabels).toEqual([l2]);
  });

  it('should remove subtheme', async () => {
    // creates dummy values
    let t1 = new Theme(1, "theme1", "desc1");
    let t2 = new Theme(2, "theme2", "desc2");
    component.addedSubThemes = [t1, t2];

    // Calls function to be tested
    component.removeSubtheme(t2);

    // checks results
    expect(component.addedSubThemes).toEqual([t1]);
  });

  it('should remove subtheme edit mode', async () => {
    // creates dummy values
    let t1 = new Theme(1, "theme1", "desc1");
    let t2 = new Theme(2, "theme2", "desc2");
    component.addedSubThemes = [t1, t2];
    component.edit = true

    // Calls function to be tested
    component.removeSubtheme(t2);

    // checks results
    expect(component.addedSubThemes).toEqual([t1]);
    expect(component.allSubThemes).toEqual([t2]);
  });

  it('should highlight label', async () => {
    // creates dummy values
    let l1 = new Label(1, "label1", "desc1", "type1");

    // Calls function to be tested
    component.highlightLabel(l1);

    // checks results
    expect(component.highlightedLabel).toEqual("label1");
  });

  it('should display label description', async () => {
    // creates dummy values
    let l1 = new Label(1, "label1", "desc1", "type1");

    // Calls function to be tested
    component.displayDescriptionLabel(l1);

    // checks results
    expect(component.selectedDescriptionLabel).toEqual("desc1");
  });

  it('should highlight subtheme', async () => {
    // creates dummy values
    let t1 = new Theme(1, "theme1", "desc1");

    // Calls function to be tested
    component.highlightSubtheme(t1);

    // checks results
    expect(component.highlightedSubtheme).toEqual("theme1");
  });

  it('should display theme description', async () => {
    // creates dummy values
    let t1 = new Theme(1, "theme1", "desc1");

    // Calls function to be tested
    component.displayDescriptionTheme(t1);

    // checks results
    expect(component.selectedDescriptionTheme).toEqual("desc1");
  });

  it('should reroute', async () => {
    // Sets some values
    component.create = true;
    component.p_id = 5;

    // Creates the spy
    let spy = spyOn(component["router"], "navigate");

    // Calls function to be tested
    component.reRouter();

    // checks results
    expect(spy).toHaveBeenCalledWith(['/project', 5, 'thememanagement']);
  });

  it('should reroute case 2', async () => {
    // Sets some values
    component.create = false;
    component.p_id = 5;
    component.t_id = 8;

    // Creates the spy
    let spy = spyOn(component["router"], "navigate");

    // Calls function to be tested
    component.reRouter();

    // checks results
    expect(spy).toHaveBeenCalledWith(['/project', 5, 'singleTheme', 8]);
  });

  it('should search through the labels', async () => {
    // sets some dummy values
    let l1 = new Label(1, "label1", "desc1", "type1");
    let l2 = new Label(2, "totally different", "desc2", "type1");
    // Sets variables
    component.allLabels = [l1, l2];
    component.labelSearch.controls["labelSearch"].setValue("label");

    // Spies on getLabels call
    spyOn(component, "get_labels");

    // Calls function to be tested
    await component.searchLabel();

    // Checks results
    expect(component.allLabels).toEqual([l1]);
  });

  it('should search through the themes', async () => {
    // sets some dummy values
    let t1 = new Theme(1, "theme1", "desc1");
    let t2 = new Theme(2, "veryWeird", "desc2");
    // Sets variables
    component.allSubThemes = [t1, t2];
    component.themeSearch.controls["themeSearch"].setValue("veryWeird");

    // Spies on getLabels call
    spyOn(component, "get_themes_without_parents");

    // Calls function to be tested
    await component.searchTheme();

    // Checks results
    expect(component.allSubThemes).toEqual([t2]);
  });
});