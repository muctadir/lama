import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { InputCheckService } from '../input-check.service';
import { ThemeDataService } from 'app/theme-data.service';
import { LabelingDataService } from 'app/labeling-data.service';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
})
export class CreateThemeComponent {

  // Error message string
  errorMsg = "";

  // Form
  themeForm = this.formBuilder.group({
    name: "",
    description: ""
  });

  //  Project id
  p_id: number;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  //highlight label variable
  highlightedLabel: String = '';
  //highlight subtheme variable
  highlightedSubtheme: String = "";

  //Selected Labels description
  selectedDescriptionLabel: String = '';
  //Selected Theme description
  selectedDescriptionTheme: String = '';

  // Labels Added
  addedLabels: Label[] = [];
  // All labels
  allLabels: Array<Label> = [];

  //Subthemes Added
  addedSubThemes: Array<Theme> = [];
  //Hard coded sub-themes
  allSubThemes: Array<Theme> = [];
 
  constructor(private formBuilder: FormBuilder, private service: InputCheckService, 
        private router: Router, private themeDataService: ThemeDataService, private labelDataService: LabelingDataService) { 
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(this.url));
  }

  ngOnInit(){
    // Get all possible themes
    this.get_themes_without_parents(this.p_id);
    // Get all possible labels
    this.get_labels(this.p_id);
  }

  // Function for creating a theme
  async createTheme(){
    // Checks input
    let not_empty = this.service.checkFilled(this.themeForm.value.name) && 
      this.service.checkFilled(this.themeForm.value.description);
                
    // Chooses desired behaviour based on validity of input
    if (not_empty) {
      this.errorMsg = "";
      // Send the theme information to the backend
      let response = await this.post_theme_info({
        "name": this.themeForm.value.name,
        "description": this.themeForm.value.description,
        "labels": this.addedLabels,
        "sub_themes": this.addedSubThemes,
        "p_id": this.p_id
      });
      // Get all possible themes
      await this.get_themes_without_parents(this.p_id)
      // Reset the added arrays
      this.addedLabels = [];
      this.addedSubThemes = [];
      // Reset the highlighted strings
      this.highlightedSubtheme = "";
      this.highlightedLabel = "";
      // Reset description
      this.selectedDescriptionLabel = '';
      this.selectedDescriptionTheme = '';
      // Reset name and description forms
      this.themeForm.reset();
      // Give succes message
      this.errorMsg = "Theme succesfully created";     
    } else {
      // Displays error message
      this.errorMsg = "Name or description not filled in";
    }
  }

  // Async function for getting all themes that have no parents
  async get_themes_without_parents(p_id: number) {
    // Put the gotten themes into the list of themes
    this.allSubThemes = await this.themeDataService.themes_without_parents(p_id);
  }

  // Async function for getting all labels in the project
  async get_labels(p_id: number) {
    // Put the gotten themes into the list of themes
    this.allLabels = await this.labelDataService.getLabels(p_id);
  }
  
  // Async function for posting the new theme info
  async post_theme_info(theme_info: any): Promise<string> {
    // Send info to backend
    return this.themeDataService.create_theme(theme_info);
  }

  // ADDING LABELS / THEMES
  //Adds labels to added labels array.
  addLabel(label: Label){
    // Check if the label was already added
    for (var addedLabel of this.addedLabels){
      if (addedLabel.getName() == label.getName()){
        // Then return
        return;
      }
    }
    // Otherwise add the label
    this.addedLabels.push(label);
  }
  //Function for adding subtheme to added subthemes array
  addSubtheme(subTheme:any){
    // Check if the sub-theme was already added
    for (var addedSubTheme of this.addedSubThemes){
      if (addedSubTheme == subTheme){
        // Then return
        return;
      }
    }
    // Otherwise add the theme
    this.addedSubThemes.push(subTheme);
  }

  // REMOVING LABELS / THEMES
  // Function for removing label
  removeLabel(label:any){
    // Go through all labels
    this.addedLabels.forEach((addedLabels, index)=>{
      // If clicked cross matches the label, splice them from the labels
      if(addedLabels==label){
        this.addedLabels.splice(index,1);
      }
    });    
  }
  // Function for removing subtheme
  removeSubtheme(subTheme:any){
  // Go through all labels
  this.addedSubThemes.forEach((addedSubThemes, index)=>{
    // If clicked cross matches the label, splice them from the labels
    if(addedSubThemes==subTheme){
      this.addedSubThemes.splice(index,1);
    }
  });    
  }

  // HIGHLIGHTING
  // Function for highlighting selected label
  highlightLabel(label:any){
    this.highlightedLabel = label.getName();
  }
  //Function for highlighting selected sub-theme
  highlightSubtheme(subtheme:any){
    this.highlightedSubtheme = subtheme.getName();
  }

  // DISPLAY DESCRIPTIONS
  //Displays the description for selected label
  displayDescriptionLabel(label:any){
    this.selectedDescriptionLabel = label.getDesc();
  }
  //Displays the description for selected theme
  displayDescriptionTheme(theme:any){
    this.selectedDescriptionTheme = theme.getDesc();
  }

  // Filler for TODO functions
  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

  /**
   * Gets the project id from the URL and reroutes to the theme page
   * of the same project
   * 
   * @trigger back button is pressed
  */
  reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'thememanagement']);
  }

}

