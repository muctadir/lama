// Victoria Bogachenkova
// Veerle Fürst
// Ana-Maria Olteniceanu
// Eduardo Costa Martins

import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import axios from 'axios';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  projects: Project[] = [];

  // On startup we get all information for the projects of the user
  ngOnInit(): void {

    // Make list of all projects

    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

      // Get the informtion needed from the back end
      let response = axios.get('http://127.0.0.1:5000/project/home', {
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
            projectJson["numberOfUsers"] = project["projectUsers"];
            projectJson["admin"] = project["projectAdmin"];

            let projectNew: Project = projectJson as Project;                

            // Add project to list
            this.projects.push(projectNew);
          }
        })
        // If there is an error
        // TODO change
        .catch(error => {console.log(error)});
        
    }   
  }
}