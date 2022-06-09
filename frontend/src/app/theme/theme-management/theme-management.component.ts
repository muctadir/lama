// Veerle Furst
 import { Component, OnInit, Query, QueryList, ViewChildren } from '@angular/core';
 import { Theme } from 'app/classes/theme';
 import { Label } from 'app/classes/label';
 import { sortEvent, SortableThemeHeader } from 'app/sortable-theme.directive';
 import { Router } from '@angular/router';
 import { ReroutingService } from 'app/services/rerouting.service';
 import axios from 'axios';
 
 @Component({
   selector: 'app-theme-management',
   templateUrl: './theme-management.component.html',
   styleUrls: ['./theme-management.component.scss']
 })
 
 export class ThemeManagementComponent  {
 
  //Pagination Settings
  page = 1;
  pageSize = 4;

  // Array for all themes
  themes: Array<Theme>;

  //  Project id
  p_id: string;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  constructor(private router: Router) {
    // Initialize the array for the themes
    this.themes = new Array<Theme>();
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = this.routeService.getProjectID(this.url);
  }

  /**
   * Reroutes to other pages
   * Has the project id
  */
  reRouter(new_page : string) : void {       
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, new_page]);
  }

  /**
   * Reroutes to other pages of the same project
   * Has project id and theme id
  */
  reRouterTheme(new_page : string, theme_id: number) : void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, new_page, theme_id]);
  }
   
  ngOnInit(): void {

    // Get all themes
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

      // Get the informtion needed from the back end
      axios.get('http://127.0.0.1:5000/theme/theme-management-info', {
        headers: {
          'u_id_token': token
        },
        params: {
          "p_id": this.p_id
        }
      })
        // When there is a response get the projects
        .then(response => {
          // Get the response data
          let themes = response.data;

          // For each theme in the list
          for (let theme of themes){

            // Get the theme information
            let themeJson = theme["theme"];
            themeJson["numberOfLabels"] = theme["number_of_labels"];

            // Create a new theme object with all information
            let newTheme: Theme = new Theme(themeJson['id'], themeJson["name"], themeJson["description"]);

            // Put labels in the theme
            newTheme.setNumberOfLabels(themeJson["numberOfLabels"]) 

            // Add theme to list
            this.themes.push(newTheme);
          }
        })
        // If there is an error
        // TODO change
        .catch(error => {
          console.log(error.response)
        });
        
      }   
    }
 
    notImplemented(): void {
      alert("Button has not been implemented yet.");
    }
  }
 
