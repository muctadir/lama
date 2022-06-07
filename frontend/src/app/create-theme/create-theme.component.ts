import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { InputCheckService } from '../input-check.service';
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
  p_id: string;

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
  addedLabels: String[] = [];

  // All labels
  allLabels: Array<Label> = [];

  //Subthemes Added
  addedSubthemes: Array<Theme> = []

  //Hard coded sub-themes
  allSubthemes: Array<Theme> = [];
 
  constructor(private formBuilder: FormBuilder, private service: InputCheckService, private router: Router) { 
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = this.routeService.getProjectID(this.url);
  }

  ngOnInit(){
    // Get all possible themes
    this.getAllThemes();
    // Get all possible labels
    // this.getAllLabels();
  }

  // Function for creating a theme
  createTheme(){
    // Checks input
    let not_empty = this.service.checkFilled(this.themeForm.value.name) && 
      this.service.checkFilled(this.themeForm.value.description);
                
    // Chooses desired behaviour based on validity of input
    if (not_empty) {
      this.errorMsg = "";
      // Check the login credentials
      
    } else {
      // Displays error message
      this.errorMsg = "Name or description not filled in";
    }
  }

  // Function for getting all themes that have no parents
  getAllThemes(){
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){
      // Get the themes that we need
      axios.get("http://127.0.0.1:5000/theme/possible-sub-themes", {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id': this.p_id
        }
      })
        .then(response =>{   
          for (let subtheme of response.data){
            let newTheme = new Theme (subtheme['id'], subtheme['name'], subtheme['description'])
            this.allSubthemes.push(newTheme)
          }
          console.log(this.allSubthemes)
        })
        .catch(error => {
          console.log(error.response.data);
        })  
    }
  }

  // Function for getting all themes that have no parents
  getAllLabels(){
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){
      // Get the themes that we need
      axios.get("http://127.0.0.1:5000/theme/all-labels", {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id': this.p_id
        }
      })
        .then(response =>{   
          // for (let subtheme of response.data){
          //   let newTheme = new Theme (subtheme['id'], subtheme['name'], subtheme['description'])
          //   this.allSubthemes.push(newTheme)
          // }
          // console.log(this.allSubthemes)
        })
        .catch(error => {
          console.log(error.response.data);
        })  
    }
  }

  // ADDING LABELS / THEMES
  //Adds labels to added labels array.
  addLabel(label:any){
    // Check if the label was already added
    for (var addedLabel of this.addedLabels){
      if (addedLabel == label.labelName){
        // Then return
        return;
      }
    }
    // Otherwise add the label
    this.addedLabels.push(label.labelName);
  }
  //Function for adding subtheme to added subthemes array
  addSubtheme(subtheme:any){
    // Check if the sub-theme was already added
    for (var addedSubtheme of this.addedSubthemes){
      if (addedSubtheme == subtheme){
        // Then return
        return;
      }
    }
    // Otherwise add the theme
    this.addedSubthemes.push(subtheme);
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
  removeSubtheme(subtheme:any){
  // Go through all labels
  this.addedSubthemes.forEach((addedSubthemes, index)=>{
    // If clicked cross matches the label, splice them from the labels
    if(addedSubthemes==subtheme){
      this.addedSubthemes.splice(index,1);
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

