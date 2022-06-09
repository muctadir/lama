// Veerle Furst
import { Component, OnInit, Query, QueryList, ViewChildren } from '@angular/core';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { sortEvent, SortableThemeHeader } from '../sortable-theme.directive';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { ThemeDataService } from 'app/theme-data.service';
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
  p_id: number;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  constructor(private router: Router, private themeDataService: ThemeDataService) {
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
    // Get the theme manegemtn info
    this.get_theme_management_info(this.p_id);
  }

  // Async function for getting the theme mangement info
  async get_theme_management_info(p_id: number){
    // Put the gotten themes into the list of themes
    this.themes = await this.themeDataService.theme_management_info(p_id);
  }


  notImplemented(): void {
  alert("Button has not been implemented yet.");
  }
}