// Veerle Furst
import { Component } from '@angular/core';
import { Theme } from 'app/classes/theme';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { ThemeDataService } from 'app/services/theme-data.service';
import { FormBuilder } from '@angular/forms';

// Enumeration for sorting
enum sorted {
  Not = 0, // Not sorted
  Asc = 1, // Sorted in ascending order
  Des = 2 // Sorted in descending order
}

@Component({
  selector: 'app-theme-management',
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss']
})

export class ThemeManagementComponent {

  //Pagination Settings
  page = 1;
  pageSize = 4;

  // Array for all themes
  themes: Array<Theme>;

  //  Project id
  p_id: number;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  //Variables for sorting - all are not sorted
  sortedName = sorted.Not; // Theme name
  sortedDesc = sorted.Not; // Theme description
  sortedNOL = sorted.Not; // Number of labels

  // var for getting search text
  searchForm = this.formBuilder.group({
    search_term: ''
  });

  constructor(private router: Router, private formBuilder: FormBuilder, private themeDataService: ThemeDataService) {
    // Initialize the array for the themes
    this.themes = new Array<Theme>();
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(this.url));
  }

  /**
   * Reroutes to other pages
   * Has the project id
  */
  reRouter(new_page: string): void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, new_page]);
  }

  /**
   * Reroutes to other pages of the same project
   * Has project id and theme id
  */
  reRouterTheme(new_page: string, theme_id: number): void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, new_page, theme_id]);
  }

  ngOnInit(): void {
    // Get the theme information from the request handler
    this.getThemes();
  }

  // Function for getting the theme info
  async getThemes(): Promise<void> {
    this.themes = await this.themeDataService.getThemes(this.p_id);
  }

  /**
   * Function for sorting on name
   * 
  */
  sortName(): void {
    // Check if it was sorted ascending
    if (this.sortedName == sorted.Asc){
      // Make the sorted enum descending
      this.sortedName = sorted.Des;
      // Sort the array
      this.themes.sort((a,b) => b.getName().localeCompare(a.getName()));
    // Check if it was sorted descending or not yet
    } else if (this.sortedName == sorted.Des || this.sortedName == sorted.Not){
      // Make the sorted enum ascending
      this.sortedName = sorted.Asc;
      // Sort the array
      this.themes.sort((a,b) => a.getName().localeCompare(b.getName()));
    }
    // Set other sorts to not sorted
    this.sortedDesc = sorted.Not;
    this.sortedNOL = sorted.Not
  }

  /**
   * Function for sorting on description
   * 
  */
  sortDesc(): void {
    // Check if it was sorted ascending
    if (this.sortedDesc == sorted.Asc){
      // Make the sorted enum descending
      this.sortedDesc = sorted.Des;
      // Sort the array
      this.themes.sort((a,b) => b.getDesc().localeCompare(a.getDesc()));
    // Check if it was sorted descending or not yet
    } else if (this.sortedDesc == sorted.Des || this.sortedDesc == sorted.Not){
      // Make the sorted enum ascending
      this.sortedDesc = sorted.Asc;
      // Sort the array
      this.themes.sort((a,b) => a.getDesc().localeCompare(b.getDesc()));
    }
    // Set other sorts to not sorted
    this.sortedName = sorted.Not;
    this.sortedNOL = sorted.Not
  }

  /**
   * Function for sorting on number of labels
   * 
  */
  sortLabels(): void {
    // Check if it was sorted ascending
    if (this.sortedNOL == sorted.Asc){
      // Make the sorted enum descending
      this.sortedNOL = sorted.Des;
      // Sort the array
      this.themes.sort((a,b) => a.getNumberOfLabels() - b.getNumberOfLabels());
    // Check if it was sorted descending or not yet
    } else if (this.sortedNOL == sorted.Des || this.sortedNOL == sorted.Not){
      // Make the sorted enum ascending
      this.sortedNOL = sorted.Asc;
      // Sort the array
      this.themes.sort((a,b) => b.getNumberOfLabels() - a.getNumberOfLabels());
    }
    // Set other sorts to not sorted
    this.sortedName = sorted.Not;
    this.sortedDesc = sorted.Not
  }

  //gets the search text
  async onEnter() {

    // Get p_id
    let p_id = Number(this.routeService.getProjectID(this.url));

    // Search text
    var text = this.searchForm.value.search_term;

    // If nothing was searched
    if(text.length == 0){
      // Get all themes anew
      this.getThemes();
    } else {
      // Otherwise search

      // Pass the search word to services
      let themesSearched = await this.themeDataService.search(text, p_id);

      
      // List for the artifacts resulting from the search
      let themeList: Array<Theme> = [];
      // For loop through all searched artifacts
      for (let theme of themesSearched) {
        // Make it an artifact object
        let newTheme = new Theme(theme['id'], theme['name'], theme['description']);
        // Append artifact to list
        themeList.push(newTheme);
      }

      this.themes = themeList;

    }
  }
}

