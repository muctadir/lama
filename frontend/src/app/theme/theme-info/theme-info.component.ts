import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { InputCheckService } from 'app/services/input-check.service';
import { ThemeDataService } from 'app/services/theme-data.service';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { FormBuilder } from '@angular/forms';
import { Label } from 'app/classes/label';
import { Theme } from 'app/classes/theme';
import { ToastCommService } from 'app/services/toast-comm.service';
import { ProjectDataService } from 'app/services/project-data.service';

@Component({
  selector: 'app-theme-info',
  templateUrl: './theme-info.component.html',
  styleUrls: ['./theme-info.component.scss']
})
export class ThemeInfoComponent implements OnInit {

  // Boolean for create
  create = false;
  // Boolean for edit
  edit = false;
  // Header of the page
  createEditThemeHeader: string = "";

  // Error message string
  errorMsg = "";

  // Form for name and description
  themeForm = this.formBuilder.group({
    name: "",
    description: ""
  });

  // Form for label search function
  labelSearch = this.formBuilder.group({
    labelSearch: ""
  });

  // Form for theme search function
  themeSearch = this.formBuilder.group({
    themeSearch: ""
  });

  // Variable for the current theme
  theme: Theme;

  // Variable for the project id
  p_id: number;
  // Variable for the theme id
  t_id: number;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  // Highlight label variable
  highlightedLabel: string = '';
  // Highlight subtheme variable
  highlightedSubtheme: string = "";

  // Selected Labels description
  selectedDescriptionLabel: string = '';
  // Selected Theme description
  selectedDescriptionTheme: string = '';

  // Labels Added
  addedLabels: Label[] = [];
  // All labels
  allLabels: Array<Label> = [];

  //Subthemes Added
  addedSubThemes: Array<Theme> = [];
  // All sub-themes
  allSubThemes: Array<Theme> = [];

  constructor(private formBuilder: FormBuilder,
    private service: InputCheckService,
    private router: Router,
    private themeDataService: ThemeDataService,
    private labelDataService: LabellingDataService,
    private toastCommService: ToastCommService,
    private projectDataService: ProjectDataService) {
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(this.url));
    // Initialize theme
    this.theme = new Theme(0, "", "");
    // Initialize themeId
    this.t_id = 0;
  }

  async ngOnInit() {
    // Check if the project is frozen
    if (await this.projectDataService.getFrozen()) {
      await this.router.navigate(['/project', this.p_id]);
      this.toastCommService.emitChange([false, "Project frozen, you cannot create or edit a theme"]);
      return;
    }

    // Set the create/edit booleans
    this.setBooleans();
    // Set the header of the page
    this.setHeader();

    // Get all possible labels
    this.get_labels(this.p_id);

    // If in edit mode, get the information and set values
    if (this.edit) {
      // Get theme id
      this.t_id = Number(this.routeService.getThemeID(this.url));
      // Get all possible themes, except this theme
      this.get_themes_without_parents(this.p_id, this.t_id);
      // Get the current theme
      this.get_single_theme_info()
        .then(() => {
          // Set the values of the page
          this.insertThemeInfo();
        })
    } else {
      // Get all possible themes
      this.get_themes_without_parents(this.p_id, 0);
    }
  }

  // Function for setting the edit/create booleans
  setBooleans(): void {
    // Set the booleans accordingly
    if (this.url.indexOf("create") > -1) {
      this.edit = false;
      this.create = true;
    } else {
      this.edit = true;
      this.create = false;
    }
  }

  // Function for setting the header of the page
  setHeader(): void {
    // Get the header based on the booleans
    if (this.create) {
      this.createEditThemeHeader = "Create";
    } else {
      this.createEditThemeHeader = "Edit";
    }
  }

  // Function for getting the theme info
  async get_single_theme_info(): Promise<void> {
    this.theme = await this.themeDataService.single_theme_info(this.p_id, this.t_id);
  }

  // Function for setting the theme info
  insertThemeInfo(): void {
    // Get the labels of the theme
    let labels = this.theme.getLabels()
    // Set the labels of the theme in the page
    if (labels != undefined) {
      this.addedLabels = labels;
    }
    // Get the children of the theme
    let children = this.theme.getChildren()
    // Set the children of the theme in the page
    if (children != undefined) {
      this.addedSubThemes = children;
    }
    // Set the name and description
    this.themeForm.setValue({
      "name": this.theme.getName(),
      "description": this.theme.getDesc()
    })
  }

  // Function for creating a theme
  async createTheme(): Promise<void> {
    // Checks input
    let not_empty = this.service.checkFilled(this.themeForm.value.name) &&
      this.service.checkFilled(this.themeForm.value.description);

    // Chooses desired behaviour based on validity of input
    if (not_empty) {
      // Make record for the theme information
      let themeInfo: Record<string, any> = {
        "name": this.themeForm.value.name,
        "description": this.themeForm.value.description,
        "labels": this.addedLabels,
        "sub_themes": this.addedSubThemes,
        "p_id": this.p_id
      }
      // When in edit
      if(this.edit){
        // Add the id of the slected theme
        themeInfo['id'] = this.theme.getId();
      }

      // Send the theme information to the backend
      let response = await this.post_theme_info(themeInfo);
      // Get all possible themes
      await this.get_themes_without_parents(this.p_id, 0);
      // Rerouter and reset if theme was created
      if (response == "Theme created" || response == "Theme edited") {
        // Reset the added arrays
        this.addedLabels = [];
        this.addedSubThemes = [];
        // Reset the highlighted strings
        this.highlightedSubtheme = "";
        this.highlightedLabel = "";
        // Reset description
        this.selectedDescriptionLabel = '';
        this.selectedDescriptionTheme = '';
        // Give success message
        this.errorMsg = response;
        // Reset name and description forms
        this.themeForm.reset();
        this.reRouter();
      }
    } else {
      // Displays error message
      this.toastCommService.emitChange([false, "Name or description not filled in"]);
    }
  }

  // Async function for getting all themes that have no parents
  async get_themes_without_parents(p_id: number, t_id: number): Promise<void> {
    // Put the gotten themes into the list of themes
    this.allSubThemes = await this.themeDataService.themes_without_parents(p_id, t_id);
  }

  // Async function for getting all labels in the project
  async get_labels(p_id: number): Promise<void> {
    // Put the gotten themes into the list of themes
    this.allLabels = await this.labelDataService.getLabels(p_id);
  }

  // Async function for posting the new theme info
  async post_theme_info(theme_info: any): Promise<string> {
    if (this.create) {
      // Send info to backend
      return this.themeDataService.create_theme(theme_info);
    } else if (this.edit) {
      return this.themeDataService.edit_theme(theme_info);
    } else {
      return "Error has occured when saving the theme";
    }
  }

  // ADDING LABELS / THEMES
  //Adds labels to added labels array.
  addLabel(label: Label): void {
    // Check if the label was already added
    for (var addedLabel of this.addedLabels) {
      if (addedLabel.getId() == label.getId()) {
        // Then return
        return;
      }
    }
    // Otherwise add the label
    this.addedLabels.push(label);
  }

  //Function for adding subtheme to added subthemes array
  addSubtheme(subTheme: Theme): void {
    // Check if the sub-theme was already added
    for (var addedSubTheme of this.addedSubThemes) {
      if (addedSubTheme.getId() == subTheme.getId()) {
        // Then return
        return;
      }
    }
    // Otherwise add the theme
    this.addedSubThemes.push(subTheme);
  }

  // REMOVING LABELS / THEMES
  // Function for removing label
  removeLabel(label: Label): void {

    // Go through all labels
    this.addedLabels.forEach((addedLabels, index) => {
      // If clicked cross matches the label, splice them from the labels
      if (addedLabels == label) {
        this.addedLabels.splice(index, 1);
      }
    });
  }

  // Function for removing subtheme
  removeSubtheme(subTheme: Theme): void {
    // Go through all labels
    this.addedSubThemes.forEach((addedSubThemes, index) => {
      // If clicked cross matches the label, splice them from the labels
      if (addedSubThemes == subTheme) {
        this.addedSubThemes.splice(index, 1);
      }
    });
    // Put the sub-theme back into the allSubThemes list
    if (this.edit) {
      // Check if the theme is already in the array
      if (this.allSubThemes.indexOf(subTheme) < 0) {
        this.allSubThemes.push(subTheme);
      }
    }
  }

  // HIGHLIGHTING
  // Function for highlighting selected label
  highlightLabel(label: Label): void {
    this.highlightedLabel = label.getName();
  }
  //Function for highlighting selected sub-theme
  highlightSubtheme(subtheme: Theme): void {
    this.highlightedSubtheme = subtheme.getName();
  }

  // DISPLAY DESCRIPTIONS
  //Displays the description for selected label
  displayDescriptionLabel(label: Label): void {
    this.selectedDescriptionLabel = label.getDesc();
  }
  //Displays the description for selected theme
  displayDescriptionTheme(theme: Theme): void {
    this.selectedDescriptionTheme = theme.getDesc();
  }

  /**
   * Gets the project id from the URL and reroutes to the theme page
   * of the same project
   * 
   * @trigger back button is pressed
  */
  reRouter(): void {
    if (this.create) {
      // Changes the route accordingly
      this.router.navigate(['/project', this.p_id, 'thememanagement']);
    } else {
      this.router.navigate(['/project', this.p_id, 'singleTheme', this.t_id]);
    }
  }

  /**
   * Function to search through all labels
   */
  async searchLabel(): Promise<void> {
    // Get the text of the form
    var text: string = this.labelSearch.value.labelSearch;
    // Get all labels
    await this.get_labels(this.p_id);
    // If the string in not empty, we look for the labels that correspons
    if (text != "") {
      // Get the array of labels that are included in the search
      let newArray = this.allLabels.filter(s => s.getName().toLowerCase().includes(text.toLowerCase()));
      // Set the labels
      this.allLabels = newArray;
    }
  }

  /**
   * Function to search through all sub-themes
   */
  async searchTheme(): Promise<void> {
    // Get the text of the form
    var text: string = this.themeSearch.value.themeSearch;
    // Get all labels
    await this.get_themes_without_parents(this.p_id, this.t_id);
    // If the string in not empty, we look for the labels that correspons
    if (text != "") {
      // Get the array of labels that are included in the search
      let newArray = this.allSubThemes.filter(s => s.getName().toLowerCase().includes(text.toLowerCase()));
      // Set the labels
      this.allSubThemes = newArray;
    }
  }

}
