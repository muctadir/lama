import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ThemeInfoComponent } from './theme-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { ThemeDataService } from 'app/services/theme-data.service';

describe('ThemeInfoComponent', () => {
  let component: ThemeInfoComponent;
  let fixture: ComponentFixture<ThemeInfoComponent>;
  let router: Router;
  let themeDataService: ThemeDataService;

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
    themeDataService = TestBed.inject(ThemeDataService)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the reRouter function when in creation
  it('Tests the reRouter function to theme manegement page', () => {
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

  // Test whether the highlighted theme description is correctly set
  it('Tests the displayDescriptionTheme function', () => {
    // Create the description
    let themeDesc = "Description";
    // Create a theme
    let theme = new Theme(1, "Theme 1", themeDesc);

    // Call the function
    component.displayDescriptionTheme(theme);
    
    // Checks whether the function works properly
    expect(component.selectedDescriptionTheme).toEqual(themeDesc);
  });

  // Test whether the highlighted label description is correctly set
  it('Tests the displayDescriptionLabel function', () => {
    // Create the description
    let labelDesc = "Description";
    // Create a theme
    let label = new Label(1, "Label 1", labelDesc, "");

    // Call the function
    component.displayDescriptionLabel(label);
    
    // Checks whether the function works properly
    expect(component.selectedDescriptionLabel).toEqual(labelDesc);
  });

  // Test whether the highlighted sub-theme is correctly set
  it('Tests the highlightSubtheme function', () => {
    // Create the description
    let themeName = "Theme 1";
    // Create a theme
    let theme = new Theme(1, themeName, "");

    // Call the function
    component.highlightSubtheme(theme);
    
    // Checks whether the function works properly
    expect(component.highlightedSubtheme).toEqual(themeName);
  });

  // Test whether the highlighted label is correctly set
  it('Tests the highlightLabel function', () => {
    // Create the description
    let labelName = "Label 1";
    // Create a theme
    let label = new Label(1, labelName, "", "");

    // Call the function
    component.highlightLabel(label);
    
    // Checks whether the function works properly
    expect(component.highlightedLabel).toEqual(labelName);
  });

  // SUBTHEME REMOVAL
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

    // Call the function
    component.removeSubtheme(theme1);
    
    // Checks whether the function works properly
    expect(component.addedSubThemes).toEqual([theme2]);
    // Checks whether the function works properly
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

    // Call the function
    component.removeSubtheme(theme1);
    
    // Checks whether the function works properly
    expect(component.allSubThemes).toEqual([theme1]);
    // Checks whether the function works properly
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

    // Call the function
    component.removeSubtheme(theme1);
    
    // Checks whether the function works properly
    expect(component.allSubThemes).toEqual([theme3, theme1]);
    // Checks whether the function works properly
    expect(component.addedSubThemes).toEqual([theme2]);
  });

  // LABEL REMOVAL
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

    // Call the function
    component.removeLabel(label1);
    
    // Checks whether the function works properly
    expect(component.addedLabels).toEqual([label2]);
    // Checks whether the function works properly
    expect(component.allLabels).toEqual(allLabels);
  });

  // Test whether removing subthemes works for edit
  it('Tests the removeSubtheme function for edit', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    let label3 = new Label(3, "", "", "");
    // Create the allSubThemes and set it
    let allLabels = [label1, label2, label3];
    component.allLabels = allLabels;
    // Create the addedSubThemes and set it
    let addedLabels = [label1, label2];
    component.addedLabels = addedLabels;
    // Set creation boolean
    component.edit = true;

    // Call the function
    component.removeLabel(label1);
    
    // Checks whether the function works properly
    expect(component.addedLabels).toEqual([label2]);
    // Checks whether the function works properly
    expect(component.allLabels).toEqual(allLabels);
  });
 // Test whether removing subthemes works for edit
  it('Tests the removeSubtheme function for edit', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    let label3 = new Label(3, "", "", "");
    // Create the allSubThemes and set it
    let allLabels = [label1, label2, label3];
    component.allLabels = allLabels;
    // Create the addedSubThemes and set it
    let addedLabels = [label1, label2];
    component.addedLabels = addedLabels;
    // Set creation boolean
    component.edit = true;

    // Call the function
    component.removeLabel(label1);
    
    // Checks whether the function works properly
    expect(component.addedLabels).toEqual([label2]);
    // Checks whether the function works properly
    expect(component.allLabels).toEqual(allLabels);
  });

  // Test whether adding subthemes works for creation
  it('Tests the addSubtheme function for creation', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    // Create the addedSubThemes and set it
    let addedSubThemes = [theme1];
    component.addedSubThemes = addedSubThemes;
    // Set the edit boolean
    component.create = true;

    // Call the function
    component.addSubtheme(theme2);
    
    // Checks whether the function works properly
    expect(component.addedSubThemes).toEqual([theme1, theme2]);
  });

  // Test whether adding subthemes works for edit
  it('Tests the addSubtheme function for edit', () => {
    // Create two themes
    let theme1 = new Theme(1, "", "");
    let theme2 = new Theme(2, "", "");
    // Create the addedSubThemes and set it
    let addedSubThemes = [theme1];
    component.addedSubThemes = addedSubThemes;
    // Set the edit boolean
    component.edit = true;

    // Call the function
    component.addSubtheme(theme2);
    
    // Checks whether the function works properly
    expect(component.addedSubThemes).toEqual([theme1, theme2]);
  });

  // Test whether adding labels works for creation
  it('Tests the addLabel function for creation', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    // Create the addedSubThemes and set it
    let addedLabels = [label1];
    component.addedLabels = addedLabels;
    // Set the edit boolean
    component.create = true;

    // Call the function
    component.addLabel(label2);
    
    // Checks whether the function works properly
    expect(component.addedLabels).toEqual([label1, label2]);
  });

  // Test whether adding labels works for edit
  it('Tests the addLabel function for edit', () => {
    // Create two themes
    let label1 = new Label(1, "", "", "");
    let label2 = new Label(2, "", "", "");
    // Create the addedSubThemes and set it
    let addedLabels = [label1];
    component.addedLabels = addedLabels;
    // Set the edit boolean
    component.edit = true;

    // Call the function
    component.addLabel(label2);
    
    // Checks whether the function works properly
    expect(component.addedLabels).toEqual([label1, label2]);
  });

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
  it('Tests if the ngOnInit function calls all correct functions when in edit mode', async () => {    
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

  // Test the setBooleans function for create
  it('Tests if the setBooleans function sets the create value correctly', async () => {
    // Set the component url
    component.url = "/project/3/createTheme";
    // Set the boolean
    component.setBooleans();

    // Check is function works correctly
    expect(component.create).toEqual(true);
    // Check is function works correctly
    expect(component.edit).toEqual(false);
  });

  // Test the setBooleans function for edit
  it('Tests if the setBooleans function sets the edit value correctly', async () => {    
    // Set the component url
    component.url = "/project/3/editTheme/1";
    // Set the boolean
    component.setBooleans();

    // Check is function works correctly
    expect(component.edit).toEqual(true);
    // Check is function works correctly
    expect(component.create).toEqual(false);
  });

  // Test the setHeader function for creation
  it('Tests if the setHeader function sets the create value correctly', async () => {    
    // Set the component edit
    component.edit = false;
    // Set the component create
    component.create = true;
    // Set the boolean
    component.setHeader();

    // Check is function works correctly
    expect(component.createEditThemeHeader).toEqual("Create");
  });

  // Test the setHeader function for edit
  it('Tests if the setHeader function sets the edit value correctly', async () => {    
    // Set the component edit
    component.edit = true;
    // Set the component create
    component.create = false;
    // Set the boolean
    component.setHeader();

    // Check is function works correctly
    expect(component.createEditThemeHeader).toEqual("Edit");
  });

  // Test the get_single_theme_info function
  it('Tests if the get_single_theme_info function calls single_theme_info correctly', async () => {  
    let theme1 = new Theme(0, "", "");
    // Spy on the single_theme_info function
    spyOn(component['themeDataService'], "single_theme_info").and.returnValue(Promise.resolve(theme1));
    // Call the function
    component.get_single_theme_info();

    // Check is function is called
    expect(themeDataService.single_theme_info).toHaveBeenCalled();
    // Check if the function works correctly
    expect(component.theme).toEqual(theme1);
  });

});
