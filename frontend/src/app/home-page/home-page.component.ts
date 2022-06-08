// Victoria Bogachenkova
// Veerle Fürst
// Ana-Maria Olteniceanu
// Eduardo Costa Martins

import { Component, OnInit } from '@angular/core';
import { Project } from '../classes/project';
import axios from 'axios';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  /* Array with the projects that the user can view */
  projects: Project[] = [];

  /**
   * When the component gets created it gathers all the projects that the user is a member of
   * 
   * @trigger on component creation
   * @modifies projects
   * 
   * TODO: Use request factory
   */
  ngOnInit(): void {

    // Make list of all projects

    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

      // Get the informtion needed from the back end
      axios.get('http://127.0.0.1:5000/project/home', {
        headers: {
          'u_id_token': token
        }
      })
        // When there is a response get the projects
        .then(response => {

          // For each project in the list
          for (let project of response.data){

            // Initialize a new project with all values
            let projectJson = project["project"];
            projectJson["numberOfArtifacts"] = project["projectNrArtifacts"];
            projectJson["numberOfCLArtifacts"] = project["projectNrCLArtifacts"];
            projectJson["users"] = project["projectUsers"];
            projectJson["admin"] = project["projectAdmin"];

            // Create the project with constructor
            let projectNew = new Project(
              projectJson["id"],
              projectJson["name"],
              projectJson["description"]
            ) 
            
            // Set other variables
            projectNew.setFrozen(projectJson["frozen"]);
            projectNew.setNumberOfArtifacts(projectJson["numberOfArtifacts"]);
            projectNew.setNumberOfCLArtifacts(projectJson["numberOfCLArtifacts"]);
            projectNew.setAdmin(projectJson["admin"]);
            projectNew.setUsers(projectJson["users"]);

            // Add project to list
            this.projects.push(projectNew);
          }
        })
        // If there is an error
        // TODO: change
        .catch(error => {console.log(error)});
        
    }   
  }

}