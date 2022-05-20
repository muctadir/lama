import { Component, OnInit } from '@angular/core';


// Project object
interface Project {
  projectName: string,
  projectDescription: string;
}

interface User {
  userName: string;
}

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss']
})

export class ProjectCreationComponent implements OnInit {


  // Functions for adding values
  addValuesProject(name:string, desc:string):Project {
    var projectName = name;
    var projectDescription = desc;
    // Return the given values
    return {projectName, projectDescription};
  }

  // Functions for adding values
  addValuesUser(name:string):User {
    var userName = name;
    // Return the given values
    return {userName};
  }

  Veerle = this.addValuesUser("Veerle");
  Vic = this.addValuesUser("Vic");
  Bartjan = this.addValuesUser("Bartjan");
  Jarl = this.addValuesUser("Jarl");
  Chinno = this.addValuesUser("Chinno");
  Chinno2 = this.addValuesUser("Chinno2");
  Chinno3 = this.addValuesUser("Chinno3");
  Chinno4 = this.addValuesUser("Chinno4");
  Chinno5 = this.addValuesUser("Chinno5");

  // Array of projects
  members: User[] = [this.Veerle, this.Vic, this.Bartjan, this.Jarl, this.Chinno, this.Chinno2, this.Chinno3, this.Chinno4, this.Chinno5];
  
  // Label types
  labelTypes: string[] = ["doing"];

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
      var project = this.addValuesProject(params['projectName'], params['projectDescription']);
                  
      // Post values
      p_response.innerHTML= "Project was created <br/>" + "It has name " + project.projectName + "<br/> And the description is: " + project.projectDescription;

      // clear form
      post_form.reset();
     
    } else {
      alert("Bad formatting");
    }
  }

  // Function for adding users
  addMembersClick(){
    console.log("hoi"); 
  }

  // Function for removing users
  removeMember(id:any){
    // Go through all members
    this.members.forEach((member, index)=>{
      // If clicked cross matches the person, splice them from the members
      if(member.userName==id){
        this.members.splice(index,1);
      }
    });    
  }

  // Function for adding a new label type input
  addLabelType(){
    this.labelTypes.push("");
  }
}
