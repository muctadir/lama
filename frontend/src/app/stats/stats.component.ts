// Ana-Maria Olteniceanu

import { Component, OnInit } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Project } from 'app/classes/project';
import { ReroutingService } from 'app/services/rerouting.service';
import { StatsDataService } from 'app/services/stats-data.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit{
  // Pagination Settings
  page = 1;
  pageSize = 10;

  // Initialize the url
  url: string;
    
  // Initialize the ReroutingService
  routeService: ReroutingService;

  // Initialize the project ID
  p_id: number;

  // Initialize the project item
  project: Project;

  // Initialize the list of user statistics
  user_contribution: Array<any>;

  // Initialize the number of conflicts in the project
  conflicts: number

  /**
   * Initializes the router 
   * 
   * @param router instance of router
   */
   constructor(private router: Router,
    private statsDataService: StatsDataService) { 
     this.url = this.router.url;
     this.routeService = new ReroutingService();
     this.p_id = Number(this.routeService.getProjectID(this.url));
     this.project = new Project(0, "", "");
     this.user_contribution = [];
     this.conflicts = 0;
   }

  ngOnInit(): void {
      // Get the project statistics from the back end
      this.getProject(this.p_id);
      
      // Get the user statistics from the backend
      this.getUserStats(this.p_id);
  }

  /**
   * Gets the data of a single project from the backend
   * 
   * @param p_id number, id of the project 
   * @modifies this.project, such that this.project contains the details of the project
   * @modifies this.conflicts, such that this.conflicts' value is equal to 
   * the number of conflicts in the project
   */
  async getProject(p_id: number): Promise<void>{
    // Make request to the backend
    const data = await this.statsDataService.getArtifact(p_id);

    // Pass the project data
    this.project = data['project_data']
    // Pass the number of conflicts
    this.conflicts = data['conflicts']
  }

  /**
   * Gets the statistics for each user
   * 
   * @param p_id number, id of the project
   * @modifies this.user_contribution, such that this.user_contribution contains an array of statistics
   * where each element has the statistics for one user
   */
  async getUserStats(p_id: number): Promise<void>{
    // Make request to the backend
    const data = await this.statsDataService.getUserStats(p_id)
    // Pass the user statistics
    this.user_contribution = data
  }

  /**
   * Gets the project id from the URL and reroutes to the labelling page
   * of the same project
   * 
   * @trigger start labelling button is pressed
   */  
  reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'labelling-page']);
  }
}
