// Victoria Bogachenkova
// Veerle Fürst
// Ana-Maria Olteniceanu

import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import axios from 'axios';


// Project object 
// interface Project {
//   projectName: string,
//   projectDescription: string;
//   numberOfUsers: number;
//   numberOfArtifacts: number;
//   numberOfCLArtifacts: number; //completely labelled artifacts
//   admin: boolean;
//   frozen: boolean;
// }

// Functions for adding values
// function addValues(name:string, descr:string, nop:number, noa:number, nocla:number, admin:boolean, frozen:boolean):Project {
//   var projectName = name;
//   var projectDescription = descr;
//   var numberOfUsers = nop;
//   var numberOfArtifacts = noa;
//   var numberOfCLArtifacts = nocla;
//   var admin = admin;
//   var frozen = frozen;
//   // Return the given values
//   return {projectName, projectDescription, numberOfUsers, numberOfArtifacts, numberOfCLArtifacts, admin, frozen};
// } 

//   // Project 1
//   var project1 = addValues('Project 1', "First project hsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dk", 20, 200, 200, true, true);
//   // Project 2
//   var project2 = addValues('Project 2', "Second project", 60, 40, 16, false, false);
//   // Project 3
//   var project3 = addValues('Project 3', "Third project", 3, 20, 10, false, true);
//   // Project 4
//   var project4 = addValues('Project 4', "Fourth project", 59, 200, 10, true, false);
//   // Project 5
//   var project5 = addValues('Project 5', "Fifth project", 7, 100, 90, true, true);
//   // Project 5
//   var project6 = addValues('Project 6', "Bliep", 80, 1100, 1000, true, true);

// //   Array of projects
//   let projects: Project[] = [project1, project2, project3, project4, project5, project6];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  // projects=projects;
  
 
  constructor( ) { }

  // On startup we get all information for the projects of the user
  ngOnInit(): void {

    // Make list of all projects
    let projects: Array<Project> = new Array()

    // Get the informtion needed from the back end
    let projectList_Json = axios.get('http://127.0.0.1:5000/auth/home')
      // TODO implement
      .then(projectList_Json => {
        let projectList = JSON.parse(projectList_Json.data);
        // console.log(projectList.data)

        // For each project in the list
        for (let project of projectList){

          // Initialize a new project with all values
          let projectNew = new Project(
            project["projectId"],
            project["projectName"],
            project["projectDesc"],
            project["projectUsers"],
            project["projectNrArtifacts"],
            project["projectNrCLArtifacts"],
            project["projectFrozen"],
            project["projectAdmin"]
          );

          // Add project to list
          projects.push(projectNew);
        }
        console.log(projects)
      })
      // If there is an error
      .catch(error => {JSON.stringify([error.response.data, error.response.status])});
  }   
}