// Victoria Bogachenkova
// Veerle Fürst

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { User } from 'app/classes/user';
import { Router } from '@angular/router';

// Project object
interface Project {
  projectName: string,
  projectDescription: string;
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
    <div class="modal-body row" *ngFor="let user of users" (click)="addUser(user)" style="padding:2px 16px; max-height: 35px;">
        <div class="col" style="padding:15 1 1 1px; list-style: none; max-height: 25px;">
          <li> {{ user.getUsername() }}</li>
        </div>
        <!-- Col for adding users button -->
        <div class="col-2">
            <!-- Button for adding new project_members -->
            <button class="btn" type="button" id="addMembersButton" (click)="addUser(user)">
              <!-- Plus icon -->
              <i class="bi bi-plus labelType" id="popup-plus"></i>
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

  addUser(user:User) {
    this.newItemEvent.emit(user);
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

  
  // Array of all possible members
  allMembers: User[] = [];
 
  // Array of members in the project
  projectMembers: User[] = []

  // Label types
  labelTypes: string[] = [];

  ngOnInit(): void { 

    // Get all users within the tool
    
    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {
      axios.get('http://127.0.0.1:5000/project/users', {
        headers: {
          'u_id_token': token
        }
      })
        .then(response => { 
          
          for (let user of response.data) {
            let newUser = new User(user.id, user.username);
            newUser.setEmail(user.email);
            newUser.setDesc(user.description);
            this.allMembers.push(newUser);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

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
  getFormElements(form:HTMLFormElement): Record<string, string>{
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

  // Function for getting all form elements
  getLabelTypes(form:HTMLFormElement): string[]{
    // Make a dictionary for all values
    let params: string[] = [];
    // For loop for adding the params to the list
    for (let i = 0; i < form.length; i++) { 
      // Add them to dictionary
      let param = form[i] as HTMLInputElement; // Typecast
      params[i] = param.value;
    }
    // Return the dictionary of values
    return params;
  }

  // Function for creating the project
  createProject():void { 
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
      let params3 = this.getLabelTypes(post_form3);

      // Way to get information to backend
      let projectInformation: Record<string, any> = {};
      // Project information
      projectInformation["project"] = {
        "name" : params1['projectName'],
        "description" : params1['projectDescription'],
        "criteria": params2["numberOfLabellers"]
      };
      // Users within the project
      projectInformation["users"] = []
      // For each user get the admin status
      for(let i=0; i< this.projectMembers.length; i++){
        let admin;
        let adminCheckbox = document.getElementById("projectAdminCheckBox-"+this.projectMembers[i].getUsername()) as HTMLInputElement;
        if(adminCheckbox!=null){
          admin = adminCheckbox?.checked;
        }
        // Push the user ids and admin status to list
        projectInformation["users"].push({
          "u_id": this.projectMembers[i].getId(),
          "admin": admin
        })
      }
      // Label type information
      projectInformation["labelTypes"] = params3;
      
      
      let token: string | null  = sessionStorage.getItem('ses_token');

      if (typeof token === "string") {        
        // Send the data to the database
        axios.post('http://127.0.0.1:5000/project/creation', projectInformation, {
          headers: {
            'u_id_token': token
          }
        })
        .then(response => { 
          // Navigates the user back to the home page
          this.router.navigate(["/home"]);

          // TODO
          p_response.innerHTML = "Project created"
        })
        .catch(error => {
          // TODO
        });
      }
     
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
    this.projectMembers.forEach((projectMembers, index)=>{
      // If clicked cross matches the person, splice them from the members
      if(projectMembers.getUsername()==id){
        this.projectMembers.splice(index,1);
      }
    });    
  }

  // Function for adding a new label type input
  addLabelType(){
    this.labelTypes.push("");
  }

  constructor(private modalService: NgbModal, private router: Router) {}

  // Open the modal and populate it with users
  open() {
    const modalRef = this.modalService.open(AddUsersModalContent);
    modalRef.componentInstance.users = this.allMembers;
    // Push the username into the members list 
    modalRef.componentInstance.newItemEvent.subscribe(($e: User) => {
       var user = $e;
      //  Checks if the user is already added
       if(!this.projectMembers.some(e => e.getUsername() === user.getUsername())){
         // If not, we add them
        this.projectMembers.push(user);
       }
    })
  }

 }

