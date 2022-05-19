import { Component, OnInit } from '@angular/core';

// Project object
interface Project {
  projectName: string,
  projectDescription: string;
}

interface User {
  userName: string;
}


// Functions for adding values
function addValuesProject(name:string, desc:string):Project {
  var projectName = name;
  var projectDescription = desc;
  // Return the given values
  return {projectName, projectDescription};
}

// Functions for adding values
function addValuesUser(name:string):User {
  var userName = name;
  // Return the given values
  return {userName};
}

let Veerle = addValuesUser("Veerle");
let Vic = addValuesUser("Vic");
let Bartjan = addValuesUser("Bartjan");
let Jarl = addValuesUser("Jarl");
let Chinno = addValuesUser("Chinno");
let Chinno2 = addValuesUser("Chinno2");
let Chinno3 = addValuesUser("Chinno3");
let Chinno4 = addValuesUser("Chinno4");
let Chinno5 = addValuesUser("Chinno5");

// Array of projects
let members: User[] = [Veerle, Vic, Bartjan, Jarl, Chinno, Chinno2, Chinno3, Chinno4, Chinno5];

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss']
})
export class ProjectCreationComponent implements OnInit {
  
  members = members;

  constructor() { }

  ngOnInit(): void { }

  // Function for creating the project
  createProject() { 
    // Get the form
    const post_form: HTMLFormElement = (document.querySelector("#projectCreationForm")! as HTMLFormElement);
    // Message for confirmation/error
    const p_response: HTMLElement = document.querySelector("#createProjectResponse")!;
    
    // Check validity of filled in form
    if (post_form != null && post_form.checkValidity()) {
      // Jarls shit
      const article = { title: 'Create Project POST Request' };

      // Typescript dictionary (string -> string)
      let params: Record<string, string> = {};
      // Take all form elements
      for (let i = 0; i < post_form.length; i++) { // No forEach for HTMLCollection
        // Add them to dictionary
        let param = post_form[i] as HTMLInputElement; // Typecast
        params[param.name] = param.value;
      }

      // Create new project with values
      var project = addValuesProject(params['projectName'], params['projectDescription']);
                  
      // Post values
      p_response.innerHTML= "Project was created <br/>" + "It has name " + project.projectName + "<br/> And the description is: " + project.projectDescription;

      // clear form
      post_form.reset();
     
    } else {
      alert("Bad formatting");
    }
  }

}
