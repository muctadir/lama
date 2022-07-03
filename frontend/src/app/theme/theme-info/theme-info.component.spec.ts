import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ThemeInfoComponent } from './theme-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';

describe('ThemeInfoComponent', () => {
  // Initializing variables
  let component: ThemeInfoComponent;
  let fixture: ComponentFixture<ThemeInfoComponent>;

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
  });

  // Test for creating the components
  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should initialize in non-edit mode', async () => {
    // Creates the spies
    let spy = spyOn(component, "get_themes_without_parents");
    let spy2 = spyOn(component, "setBooleans");
    let spy3 = spyOn(component, "setHeader");
    let spy4 = spyOn(component, "get_labels");

    // Sets the variable
    component.edit = false

    // Calls function to be tested
    await component.ngOnInit();

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should initialize in edit mode', async () => {
    // Creates the spies
    let spy = spyOn(component, "get_themes_without_parents");
    let spy2 = spyOn(component, "setBooleans");
    let spy3 = spyOn(component, "setHeader");
    let spy4 = spyOn(component, "get_labels");
    let spy5 = spyOn(component["routeService"], "getThemeID");

    component.edit = true;

    // Calls function to be tested
    await component.ngOnInit();

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  it('should set booleans', async () => {
    // Sets value
    component.url = "abccreate";

    // Calls function to be tested
    component.setBooleans();

    // Does the checks
    expect(component.edit).toBeFalse();
    expect(component.create).toBeTrue();
  });

  it('should set booleans case 2', async () => {
    // Sets value
    component.url = "abc";

    // Calls function to be tested
    component.setBooleans();

    // Does the checks
    expect(component.edit).toBeTrue();
    expect(component.create).toBeFalse();
  });

  it('should set create header', async () => {
    // Sets value
    component.create = true;

    // Calls function to be tested
    component.setHeader();

    // Does the checks
    expect(component.createEditThemeHeader).toEqual("Create");
  });

  it('should set edit header', async () => {
    // Sets value
    component.create = false;

    // Calls function to be tested
    component.setHeader();

    // Does the checks
    expect(component.createEditThemeHeader).toEqual("Edit");
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