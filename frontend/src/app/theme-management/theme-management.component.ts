/**
 * What the hell is this?
 * Well - This is some really rough code for the theme management page.
 * Q: Why is it such a mess?
 * A: I suck - partially. @Vic came with this briliant suggestion https://ng-bootstrap.github.io/#/components/table/examples#sortable
 *    It is a good idea, but I had already done a lot of other stuff. I tried to morph my code into that but that turned out to be difficult.
 *    I will come back to this!
 */
 import { Component, OnInit, Query, QueryList, ViewChildren } from '@angular/core';
 import { Theme } from 'app/classes/theme';
 import { Label } from 'app/classes/label';
 import { sortEvent, SortableThemeHeader } from '../sortable-theme.directive';
 import { Router } from '@angular/router';
 import { ReroutingService } from 'app/rerouting.service';
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
      axios.post('http://127.0.0.1:5000/theme/get-themes', {"p_id": this.p_id}, {
        headers: {
          'u_id_token': token
        }
      })
        // When there is a response get the projects
        .then(response => {
          // Get the response data
          let themes = response.data;

          // For each project in the list
          for (let theme of themes){

            // Initialize a new project with all values
            let themeJson = theme["theme"];
            themeJson["labels"] = theme["labels"];

            // Create a new theme object with all information
            let newTheme: Theme = new Theme(themeJson['id'], themeJson["name"], themeJson["description"]);

            // Making all labels actual labels
            let labelList: Array<Label> = [];
            for(let label of themeJson["labels"]){
              let newLabel: Label = label as Label;
              labelList.push(newLabel);
            }
            // Put labels in the theme
            newTheme.setLabels(labelList) 

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
 
