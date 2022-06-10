import { Component, OnInit } from '@angular/core';
import { Theme } from 'app/classes/theme';
import { StringArtifact } from 'app/classes/stringartifact';
import {ActivatedRoute, Router} from "@angular/router";
import { ReroutingService } from 'app/services/rerouting.service';
import { ThemeDataService } from 'app/services/theme-data.service';
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
  t_id: number;
  //  Project id
  p_id: number;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  // List for the theme
  theme: Theme; 

  constructor(private router: Router, private themeDataService: ThemeDataService) { 
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(this.url));
    // Use reroutingService to obtain the project ID
    this.t_id = Number(this.routeService.getThemeID(this.url));
    // Initialize theme
    this.theme = new Theme(0, "", "")
  }
  
  ngOnInit(): void {
    // Get the information for the theme
    this.get_single_theme_info(this.p_id, this.t_id);
  }

  // Async function for getting the single theme info
  async get_single_theme_info(p_id: number, t_id: number){
    // Put the gotten themes into the list of themes
    this.theme = await this.themeDataService.single_theme_info(p_id, t_id);
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
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'thememanagement']);
  }

  /**
   * Reroutes to other pages of the same project
   * Has the theme id
   * @trigger a child or parent theme is clicked
  */
  reRouterTheme(theme_id: number) : void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, "singleTheme", theme_id])
    // And reload the page
    .then(() => {
      window.location.reload();
    });
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

  /**
   * Function to redirect user to theme they clicked on
   * 
   * @trigger a sub or super-theme is pressed
  */
  goToTheme(theme: Theme | undefined){
    if (theme != undefined){
      this.reRouterTheme(theme.getId());
    }
  }

}
