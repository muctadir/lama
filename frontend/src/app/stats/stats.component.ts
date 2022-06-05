// Ana-Maria Olteniceanu

import { Component, OnInit } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Project } from 'app/classes/project';
import { ReroutingService } from 'app/rerouting.service';
import axios from 'axios';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit{
  /**
   * Initializes the router 
   * 
   * @param router instance of router
   */
   constructor(private router: Router) { }

  // Pagination Settings
  page = 1;
  pageSize = 10;

  // Get project ID
  // Gets the url from the router
  url: string = this.router.url
    
  // Initialize the ReroutingService
  routeService: ReroutingService = new ReroutingService();

  // Use reroutingService to obtain the project ID
  p_id = this.routeService.getProjectID(this.url);

  // Project item
  project: Project = new Project(0, "", "")

  // Dummy data
  user_contribution: Array<any> = []

  ngOnInit(): void {
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

      // Get the project information needed from the back end
      axios.get('http://127.0.0.1:5000/project/singleProject', {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id': this.p_id
        }
      })
        // When there is a response get the projects
        .then(response => {
          // Get project data from response
          let project = response.data
          // Initialize a new project with all values
          let projectJson = project["project"];
          projectJson["numberOfArtifacts"] = project["projectNrArtifacts"];
          projectJson["numberOfCLArtifacts"] = project["projectNrCLArtifacts"];
          projectJson["users"] = project["projectUsers"];

            // Create the project with constructor
            let projectNew = new Project(
              projectJson["id"],
              projectJson["name"],
              projectJson["description"]
            ) 
            
            // Set other variables
            projectNew.setNumberOfArtifacts(projectJson["numberOfArtifacts"]);
            projectNew.setNumberOfCLArtifacts(projectJson["numberOfCLArtifacts"]);
            projectNew.setUsers(projectJson["users"]);

            // Pass the project data to the project item
            this.project = projectNew
        })
        // If there is an error
        // TODO change
        .catch(error => {console.log(error)});

         // Get the project statistics from the back end
      axios.get('http://127.0.0.1:5000/project/projectStats', {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id': this.p_id
        }
      })
        // When there is a response get the projects
        .then(response => {
          // For the statistics of each user in the response
          for (let stat of response.data){
           // Add the stats to the list of statistics
            this.user_contribution.push(stat)
          }
          console.log(response.data)
        })
        // If there is an error
        // TODO change
        .catch(error => {console.log(error)});
        
    }   
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
