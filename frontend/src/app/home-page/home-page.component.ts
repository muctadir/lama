import { Component, OnInit } from '@angular/core';


// Project object 
interface Project {
  projectName: string,
  projectDescription: string;
  numberOfUsers: number;
  numberOfArtifacts: number;
  numberOfCLArtifacts: number; //completely labelled artifacts
}
// Functions for adding values
function addValues(name:string, descr:string, nop:number, noa: number, nocla: number):Project {
  var projectName = name;
  var projectDescription = descr;
  var numberOfUsers = nop;
  var numberOfArtifacts = noa;
  var numberOfCLArtifacts = nocla;
  // Return the given values
  return {projectName, projectDescription, numberOfUsers, numberOfArtifacts, numberOfCLArtifacts};
} 

  // Project 1
  var project1 = addValues('Project 1', "First project hsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dkhsjIENDJIAIEN SSJAIEJ hdhajdiej Jjdhduedndns djjs jdake dk", 20, 200, 200);
  // Project 2
  var project2 = addValues('Project 2', "Second project", 60, 40, 16);
  // Project 3
  var project3 = addValues('Project 3', "Third project", 3, 20, 10);
  // Project 4
  var project4 = addValues('Project 4', "Fourth project", 59, 200, 10);

  // Array of projects
  let projects: Project[] = [project1, project2, project3, project4];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  
  projects = projects;
  project = projects[0];
  
  constructor( ) { }

  ngOnInit(): void { }

  
}