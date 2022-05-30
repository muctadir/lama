// Victoria Bogachenkova
// Veerle Fürst

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

// Project object
interface Project {
  projectName: string,
  projectDescription: string;
}

// User object
interface User {
  userName: string;
}

// Template for the modal
@Component({
  selector: 'app-project-creation',
  styleUrls: ['./project-creation.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Choose the users to add to the project</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body row" *ngFor="let user of users" style="padding:2px 16px; max-height: 25px;">
        <div class="col" style="padding:15 1 1 1px; list-style: none; max-height: 25px;">
          <li> {{ user.userName }}</li>
        </div>
        <!-- Col for adding users button -->
        <div class="col-2">
            <!-- Button for adding new project_members -->
            <button class="btn" type="button" id="addMembersButton" (click)="addUser(user.userName)">
              <!-- Plus icon -->
              <i class="bi bi-plus labelType"></i>
            </button>
        </div>
        <br>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})

// Content of the modal
export class AddUsersModalContent {
  @Input() users: any;
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  addUser(name:string) {
    this.newItemEvent.emit(name);
  }
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

  // Fake users
  Veerle = this.addValuesUser("Veerle");
  Vic = this.addValuesUser("Vic");
  Bartjan = this.addValuesUser("Bartjan");
  Jarl = this.addValuesUser("Jarl");
  Chinno = this.addValuesUser("Chinno");
  Chinno2 = this.addValuesUser("Chinno2");
  Chinno3 = this.addValuesUser("Chinno3");
  Chinno4 = this.addValuesUser("Chinno4");
  Chinno5 = this.addValuesUser("Chinno5");
  Chinno6 = this.addValuesUser("Chinno6");
  Chinno7 = this.addValuesUser("Chinno7");

  // Array of all possible members
  all_members: User[] = [this.Veerle, this.Vic, this.Bartjan, this.Jarl, this.Chinno, this.Chinno2, this.Chinno3, this.Chinno4, this.Chinno5, this.Chinno6, this.Chinno7];
  // Array of members in the project
  project_members: User[] = []

  // Label types
  labelTypes: string[] = ["doing", "floing"];

  ngOnInit(): void { 
    // TODO
    // Get the person who is creating the project
    // Add that person to this project
    // addUser(user.userName);
    // Give that user the admin role
    // Get the checkbox of the current user
    // let currentUserCheckbox = document.getElementById("projectAdminCheckBox'+Jarl'") as HTMLInputElement;
    // Make the checkbox checked
    // if (currentUserCheckbox != null) {
    //   currentUserCheckbox.checked = true;
    // }

  }

  // Function for getting all form elements
  getFormElements(form:HTMLFormElement){
    // Make a dictionary for all values
    let params: Record<string, string> = {};
    // For loop for adding the params to the list
    for (let i = 0; i < form.length; i++) { 
      // Add them to dictionary
      let param = form[i] as HTMLInputElement; // Typecast
      params[param.name] = param.value;
    }
    // Return the dictionary of values
    return params;
  }

  // Function for creating the project
  createProject() { 
    // Get the forms
    // For with name and description
    const post_form1: HTMLFormElement = (document.querySelector("#projectCreationForm")!);
    // Form with the number of labellers
    const post_form2: HTMLFormElement = (document.querySelector("#constraintForm")!);
    // For with the label types
    const post_form3: HTMLFormElement = (document.querySelector("#labelTypeForm")!);

    // Message for confirmation/error
    const p_response: HTMLElement = document.querySelector("#createProjectResponse")!;

    // Get all input fields
    const inputFeilds = document.querySelectorAll("input");
    // Check if the input fields are filled in
    const validInputs = Array.from(inputFeilds).filter( input => input.value == "");
    // Get the description field
    const descField = document.getElementById("projectDescriptionForm") as HTMLInputElement;
    // Check if its filled in
    if(descField != null){
      if(descField.value == ""){
        // Otherwise push it
        validInputs.push(descField);
      }
    }
    
    // Check validity of filled in form
    if (validInputs.length == 0) {

      // Params of the name and description
      let params1 = this.getFormElements(post_form1);
      // Params of the number of labellers
      let params2 = this.getFormElements(post_form2);
      // Params of the label types
      let params3 = this.getFormElements(post_form3);

      // TODO change to backend stuff
      // Create new project with values
      var project = this.addValuesProject(params1['projectName'], params1['projectDescription']);    
      // Post values
      p_response.innerHTML= "Project was created <br/>" + "It has name " + project.projectName + "<br/> And the description is: " + project.projectDescription;
      // clear form
      post_form1.reset();

      // Create new project with values
      var constraint = params2["numberOfLabellers"];
      // Post values
      p_response.innerHTML += "<br/> numberOfLabellers: " + constraint;

      for (let labelType of this.labelTypes){
        // Create new project with values
        var labelTypesValue = params3['labelType-' + labelType];
        console.log("labelType"+labelType);
        console.log(labelTypesValue);
        // Post values
        p_response.innerHTML += "<br/> labelType: " + labelTypesValue;
      }

      // Add the members
      for(let member of this.project_members){
        // Post values
        p_response
      }
        
      // Send the data to the database
        // const response = axios.post('http://127.0.0.1:5000/auth/register', params)
        // .then(response => p_response.innerHTML = JSON.stringify([response.data, response.status]))
        // .catch(error => {
        //   p_response.innerHTML = JSON.stringify([error.response.data, error.response.status])
        // });
     
    } else {
      // Send error message
      p_response.innerHTML = "Fill in all fields!";
      // Make the error message red
      let responseObject = document.getElementById("createProjectResponse");
      if(responseObject != null){
        responseObject.style.color = 'red';
        }
    }
  }

  // Function for removing users
  removeMember(id:any){
    // Go through all members
    this.project_members.forEach((project_members, index)=>{
      // If clicked cross matches the person, splice them from the members
      if(project_members.userName==id){
        this.project_members.splice(index,1);
      }
    });    
  }

  // Function for adding a new label type input
  addLabelType(){
    this.labelTypes.push("");
  }

  constructor(private modalService: NgbModal) {}

  // Open the modal and populate it with users
  open() {
    const modalRef = this.modalService.open(AddUsersModalContent);
    modalRef.componentInstance.users = this.all_members;
    // Push the username into the members list 
    modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
      var username = {userName: $e};
      this.project_members.push(username);
    })
  }

 }

