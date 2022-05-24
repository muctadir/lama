import { Component, OnInit } from '@angular/core';
// import { Project } from '../project';


// Project object 
interface Project {
  projectName: string,
  projectDescription: string;
  numberOfUsers: number;
  numberOfArtifacts: number;
  numberOfCLArtifacts: number; //completely labelled artifacts
  admin: boolean;
  frozen: boolean;
}

// Functions for adding values
function addValues(name:string, descr:string, nop:number, noa:number, nocla:number, admin:boolean, frozen:boolean):Project {
  var projectName = name;
  var projectDescription = descr;
  var numberOfUsers = nop;
  var numberOfArtifacts = noa;
  var numberOfCLArtifacts = nocla;
  var admin = admin;
  var frozen = frozen;
  // Return the given values
  return {projectName, projectDescription, numberOfUsers, numberOfArtifacts, numberOfCLArtifacts, admin, frozen};
} 

  // Project 1
  var project1 = addValues('Project 1', "First project hsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dk", 20, 200, 200, true, true);
  // Project 2
  var project2 = addValues('Project 2', "Second project", 60, 40, 16, false, false);
  // Project 3
  var project3 = addValues('Project 3', "Third project", 3, 20, 10, false, true);
  // Project 4
  var project4 = addValues('Project 4', "Fourth project", 59, 200, 10, true, false);
  // Project 5
  var project5 = addValues('Project 5', "Fifth project", 7, 100, 90, true, true);

  // Array of projects
  let projects: Project[] = [project1, project2, project3, project4, project5];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  
  projects = projects;
 
  constructor( ) { }

  ngOnInit(): void {
    // 1. get all projects the user can see and save the id, name, description, and frozen
    // 2. get whether the user is admin or not and save this boolean
    // 3. get all artifacts per project and save this number
    // 4. get all completely labelled artifacts per project and save this number
    // 5. get all users within a project and save this number


    // Get userID of logged in user
    // userID = getUserID();

    // Make list of all projects
    // projects = Project[];

    // project1 = new Project(1, "hey", "hello", false); // this works

    // Get all project per user
    // for each row in returned query
    // projects[i] = new Project(projectID, projectName, projectDesc, frozen)

    // Get admin status
    // for each item in projects, do query
    // projects[i].setAdminProject(admin);

    // Get total number of artifacts status
    // for each item in projects, do query
    // projects[i].setArtifactsProject(totalNumberOfArtifacts);

    // Get number of completely labelled artifacts
    // for each item in projects, do query
    // projects[i].setnumberOfCLArtifacts(numberOfCLArtifacts)

    // Get number of users
    // for each item in projects, do query
    // projects[i].setnumberOfUsers(numberOfUsers)

  }

   
}