import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordion, NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StringArtifact } from 'app/classes/stringartifact';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { SingleThemeViewComponent } from './single-theme-view.component';
import { HistoryComponent } from 'app/modals/history/history.component';
import { of } from 'rxjs';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';

describe('SingleThemeViewComponent', () => {
  let component: SingleThemeViewComponent;
  let fixture: ComponentFixture<SingleThemeViewComponent>;
  let router: Router;
  // Instantiation of NgbModal
  let modalService: NgbModal;
  // Instantiation of NgbModalRef
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adding the NgbAccordion dependency, unsure why this needs to be imported for the test case
      declarations: [SingleThemeViewComponent, NgbAccordion],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule],
      providers: [NgbActiveModal]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    // Inject the modal service into the component's constructor
    modalService = TestBed.inject(NgbModal)

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
  it('should call all functions on initialization', () => {
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
  it('should get the information for a single theme', async () => {
    // Create spy for get url call
    let spy1 = spyOn(component['themeDataService'], "single_theme_info")
    // Create spy for the sort artifacts function
    let spy2 = spyOn(component, "sortArtifacts")
    // Calls the get_single_theme_info function
    await component.get_single_theme_info(1, 1);
    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Test the sortArtifacts function
  it('should sort the artifacts on ID', async () => {
    // Create a theme
    let theme = new Theme(1, "New Theme", "Theme desc")
    // Create labels
    let fakeLabels = [new Label(1, "Label name", "Label desc", "Emotion"), new Label(2, "Label name 2", "Label desc 2", "Emotion")]
    // Set labels of theme
    theme.setLabels(fakeLabels)

    // Spy on the function and call fake
    spyOn(component, "sortArtifacts").and.callFake(() => {
      // Get the labels of the theme and check
      let spy1 = spyOn(theme, "getLabels");
      let labels = theme.getLabels();
      expect(spy1).toHaveBeenCalled();
      if (labels != undefined) {
        // For each label, get the artifacts
        for (let label of labels) {
          // Get the artifacts and check
          let spy2 = spyOn(label, "getArtifacts");
          let artifacts = label.getArtifacts();
          expect(spy2).toHaveBeenCalled();
          // Create 3 artifacts
          let artifact1 = new StringArtifact(1, "Identifier 1", "Data 1");
          let artifact2 = new StringArtifact(2, "Identifier 2", "Data 2");
          let artifact3 = new StringArtifact(3, "Identifier 3", "Data 3");
          // Give label 1 artifacts
          label.setArtifacts([artifact2, artifact3, artifact1])
          if (artifacts != undefined) {
            // Sort the artifacts
            artifacts.sort((a, b) => a.getId() - b.getId());
          }
          // Set the artifacts of the label with the sorted array
          label.setArtifacts(artifacts);
          expect(label.getArtifacts).toEqual([artifact1, artifact2, artifact3])
        }
      }
    })
  });

  // Test the reRouter function
  it('should reroute to the theme management page', () => {
    // Set p_id and t_id in component
    component.p_id = 5;
    component.t_id = 1;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/' + component.p_id + '/singleTheme' + component.t_id);
    // Create spy on the router.navigate function
    spyOn(router, 'navigate');
    // Calls the reRouter function
    component.reRouter();
    // Checks whether the function works properly
    expect(router.navigate).toHaveBeenCalledWith(['/project', component.p_id, 'thememanagement']);
  });

  // Test the reRouterTheme function
  it('should reroute to the single theme page', async () => {
    // Variable for new theme id
    let newThemeId = 2;
    // Set p_id and t_id in component
    component.p_id = 5;
    component.t_id = 1;
    // Create spy for get url call
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/' + component.p_id + '/singleTheme' + component.t_id);
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
  it('should reroute to the edit theme page', () => {
    // Set p_id and t_id in component
    component.p_id = 5;
    component.t_id = 1;
    // Get a value from the router
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/' + component.p_id + '/singleTheme' + component.t_id);
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
  it('should go the single theme page of a selected theme', () => {
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
  it('should delete the theme and display success toast', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(true);
    // List of hardcoded themes
    let themes: Theme[] = [];
    // List of hardcoded labels
    let labels: Label[] = [];
    // Set the project id 
    component.p_id = 1;
    // Set the theme id
    component.t_id = 3;

    // Spy on the functions that should have been called
    let spy1 = spyOn(component['theme'], 'getChildren').and.returnValue(themes);
    let spy2 = spyOn(component['theme'], 'getLabels').and.returnValue(labels);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['themeDataService'], 'delete_theme');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.deleteTheme();

    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    expect(delete_spy).toHaveBeenCalledWith(1, 3)
    expect(navigate_spy).toHaveBeenCalledWith(['/project', 1, 'thememanagement'])
    expect(toast_spy).toHaveBeenCalledWith([true, "Deletion successful"])
  });

  // Test that the deleteTheme function does nothing if the confirm modal returns false
  it('should not do anything', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(false);
    // List of hardcoded themes
    let themes: Theme[] = [];
    // List of hardcoded labels
    let labels: Label[] = [];
    // Set the project id 
    component.p_id = 1;
    // Set the theme id
    component.t_id = 3;

    // Spy on the functions that should have been called
    let spy1 = spyOn(component['theme'], 'getChildren').and.returnValue(themes);
    let spy2 = spyOn(component['theme'], 'getLabels').and.returnValue(labels);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['themeDataService'], 'delete_theme');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.deleteTheme();

    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(modal_spy).toHaveBeenCalledWith(ConfirmModalComponent, {});
    expect(delete_spy).not.toHaveBeenCalled();
    expect(navigate_spy).not.toHaveBeenCalled();
    expect(toast_spy).not.toHaveBeenCalledWith([true, "Deletion successful"]);
    expect(toast_spy).not.toHaveBeenCalledWith([false,
      "This theme has sub-themes and/or labels, so it cannot be deleted"]);
  });

  // Test that the deleteTheme displays a failure toast when the theme has labels
  it('should display failure toast when the theme has labels', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(false);
    // List of hardcoded themes
    let themes: Theme[] = [];
    // List of hardcoded labels
    let labels: Label[] = [new Label(1, "Label 1", "Label 1", "Type"), new Label(2, "Label 2", "Label 2", "Type")];
    // Set the project id 
    component.p_id = 1;
    // Set the theme id
    component.t_id = 3;

    // Spy on the functions that should have been called
    let spy1 = spyOn(component['theme'], 'getChildren').and.returnValue(themes);
    let spy2 = spyOn(component['theme'], 'getLabels').and.returnValue(labels);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['themeDataService'], 'delete_theme');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.deleteTheme();

    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(modal_spy).not.toHaveBeenCalled();
    expect(delete_spy).not.toHaveBeenCalled();
    expect(navigate_spy).not.toHaveBeenCalled();
    expect(toast_spy).not.toHaveBeenCalledWith([true, "Deletion successful"]);
    expect(toast_spy).toHaveBeenCalledWith([false,
      "This theme has sub-themes and/or labels, so it cannot be deleted"]);
  });

  // Test that the deleteTheme displays a failure toast when the theme has themes
  it('should display failure toast when the theme has labels', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(ConfirmModalComponent);
    // Set the value of componentInstance.confirmEvent to false
    modalRef.componentInstance.confirmEvent = of(false);
    // List of hardcoded themes
    let themes: Theme[] = [new Theme(1, "Theme 1", "Theme 1"), new Theme(2, "Theme 2", "Theme 2")];
    // List of hardcoded labels
    let labels: Label[] = [];
    // Set the project id 
    component.p_id = 1;
    // Set the theme id
    component.t_id = 3;

    // Spy on the functions that should have been called
    let spy1 = spyOn(component['theme'], 'getChildren').and.returnValue(themes);
    let spy2 = spyOn(component['theme'], 'getLabels').and.returnValue(labels);
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef);
    let delete_spy = spyOn(component['themeDataService'], 'delete_theme');
    let navigate_spy = spyOn(component['router'], 'navigate');
    let toast_spy = spyOn(component['toastCommService'], 'emitChange');

    // Calls the deleteTheme function
    await component.deleteTheme();

    // Checks whether the function works properly
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(modal_spy).not.toHaveBeenCalled();
    expect(delete_spy).not.toHaveBeenCalled();
    expect(navigate_spy).not.toHaveBeenCalled();
    expect(toast_spy).not.toHaveBeenCalledWith([true, "Deletion successful"]);
    expect(toast_spy).toHaveBeenCalledWith([false,
      "This theme has sub-themes and/or labels, so it cannot be deleted"]);
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


  // Tesst if the openThemeHistory function works correctly
  it('should openThemeHistory the artifact upload modal', async () => {
    // Instance of NgbModalRef
    modalRef = modalService.open(HistoryComponent);
    // When modalService.open gets called, return modalRef
    let modal_spy = spyOn(component['modalService'], 'open').and.returnValue(modalRef)

    // Call the open function
    component.openThemeHistory();
    // Close the modalRef
    await modalRef.close();

    // Check if modalService.open is called with the correct parameters
    expect(modal_spy).toHaveBeenCalledWith(HistoryComponent, { size: 'xl' });
    // Check if modalRef.componentInstance.history_type is set correctly
    expect(modalRef.componentInstance.history_type).toEqual("Theme");
  });

});
