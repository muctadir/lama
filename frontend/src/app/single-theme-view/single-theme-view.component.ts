import { Component, OnInit } from '@angular/core';
import { Theme } from 'app/classes/theme';
import { StringArtifact } from 'app/classes/stringartifact';
import {ActivatedRoute, Router} from "@angular/router";
import { ReroutingService } from 'app/rerouting.service';
import axios from 'axios';
import { Label } from 'app/classes/label';

//Test array for label holding artifacts

@Component({
  selector: 'app-single-theme-view',
  templateUrl: './single-theme-view.component.html',
  styleUrls: ['./single-theme-view.component.scss']
})
export class SingleThemeViewComponent {

  // Variable for theme id
  themeId: string;

  //  Project id
  p_id: string;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  // List for the theme
  theme: Theme;

  constructor(private router: Router) { 
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = this.routeService.getProjectID(this.url);
    // Use reroutingService to obtain the project ID
    this.themeId = this.routeService.getThemeID(this.url);
    // Initialize theme
    this.theme = new Theme(0, "", "")
  }
  
  // Function for making sure parent name is not undefined
  getParentName(): string {
    // Get the parent
    let parent = this.theme.getParent();
      // Check is parent is undefined
      if(parent != undefined){
        if(parent.getName() != undefined){
          // If not return the name
          return parent.getName();
        } else {
          // Otherwise return ""
          return "";
        }
      }   
      // Otherwise return ""
      return "";
  }

  ngOnInit(): void {

    // Get the information for the theme
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

      // Get the informtion needed from the back end
      axios.get('http://127.0.0.1:5000/theme/single-theme-info', {
        headers: {
          'u_id_token': token
        },
        params: {
          "p_id": this.p_id, 
          "t_id":this.themeId
        }
      })
        // When there is a response get the projects
        .then(response => {

          // Get the response data
          let themeInfo = response.data;

          // Get the theme data
          let theme = themeInfo["theme"];
          // Get the super-theme data
          let superTheme = themeInfo["super_theme"]
          // Get the sub-theme data
          let subThemes = themeInfo["sub_themes"];
          // Get the label data
          let labels = themeInfo["labels"]

          // Create a new theme object with all information
          let newTheme: Theme = new Theme(theme['id'], theme["name"], theme["description"]);

          // Set the parent
          newTheme.setParent(new Theme(superTheme["id"], superTheme["name"], superTheme["description"]));

          // CHILDREN
          // List for the children
          let childArray: Array<Theme> = [];
          // For each child make an object
          for (let child of subThemes){
            // Add the child to the array
            childArray.push(new Theme(child["id"], child["name"], child["description"]));
          }
          // Add the childern to the theme
          newTheme.setChildren(childArray);

          // LABELS
          // List for the labels 
          let labelsArray: Array<Label> = [];
          // For each label in the list
          for (let label of labels){
            let label_info = label["label"]
            // Make a new label object
            let newLabel = new Label(label_info["id"], label_info["name"], label_info["description"], label["label_type"])

            // ARTIFACTS
            // List for the artifacts
            let artifactArray: Array<StringArtifact> = [];
            for (let artifact of label["artifacts"]){
              // Push the new artifact
              artifactArray.push(new StringArtifact(artifact["id"], artifact["identifier"], artifact["data"]));
            }
            // Add artifacts to the label
            newLabel.setArtifacts(artifactArray);

            // Add alabel to the labels
            labelsArray.push(newLabel)
          }
          // Add labels to the theme
          newTheme.setLabels(labelsArray);

          this.theme = newTheme;
          
        })
        // If there is an error
        // TODO change
        .catch(error => {
          console.log(error.response.data)
        });
        
    }
  }

  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

  /**
   * Gets the project id from the URL and reroutes to the theme management page
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
