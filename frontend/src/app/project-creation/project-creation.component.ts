// Victoria Bogachenkova
// Veerle Fürst
// Jarl Jansen

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { User } from 'app/classes/user';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

// Project object
interface Project {
  projectName: string,
  projectDescription: string;
}


/* Component of the add user modal */
@Component({
  selector: 'app-project-creation',
  styleUrls: ['./project-creation.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Choose the users to add to the project</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body row" *ngFor="let user of users" (click)="addUser(user)" id="user-modal-rows">
        <div class="col" id="username-modal-col">
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
  // The users that should be displayed in the modal
  @Input() users: any;
  // Events emitting what user is added to the project
  @Output() newItemEvent = new EventEmitter<any>();

  // Initializes the add users modal
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Function which emits the user clicked on by the user
   * 
   * @param user that has been clicked on
   * 
   * @trigger user is clicked on in the modal
   */
  addUser(user: User) : void {
    this.newItemEvent.emit(user);
  }
}

/* Project creation component */
@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss']
})

export class ProjectCreationComponent implements OnInit {
  /* Array of holding all possible members which can be added */
  allMembers: User[] = [];
 
  /* Array with all members of the project getting created */
  projectMembers: User[] = [];

  projectForm : FormGroup = this.formBuilder.group({
    projectName: '',
    projectDesc: '',
    labellerCount: 2,
    labeltypes: this.formBuilder.array([])
  });

  constructor(private modalService: NgbModal, private router: Router, private formBuilder: FormBuilder) {}

  /**
   * Gets all the users within the application from the backend
   * Stores the users in the allMembers array
   * 
   * @modifies allMembers
   * @trigger on creation of component
   */
  ngOnInit(): void { 
    // Gets the authentication token from the session storage
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Get all users within the tool
    this.requestUsers(token);
  }

  /**
   * Gets all the users in the application from the backend
   * 
   * @param token used for authenticating the user to the backend
   * 
   * @trigger on component load
   * @modifies allMembers
   */
  requestUsers(token : string | null) : void {
    // Checks whether the token is valid
    if (typeof token === "string") {
      // Requests all users in the application from the backend
      axios.get('http://127.0.0.1:5000/project/users', {
        headers: {
          'u_id_token': token
        }
      })
        .then(response => { 
          // parses the database response for all the different users
          for (let user of response.data) {
            // creates the object
            let newUser = new User(user.id, user.username);
            // passes additional data to the newly created user object
            newUser.setEmail(user.email);
            newUser.setDesc(user.description);
            // pushes the new user to the array of all users
            this.allMembers.push(newUser);
          }
        })
        // Logs the error if an error occurs during communication with backend
        .catch(error => {
          console.log(error);
        });
    }
  }

  // Function for getting all form elements
  getFormElements(form: HTMLFormElement): Record<string, string>{
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
  createProject() : void { 

    // Way to get information to backend
    let projectInformation: Record<string, any> = {};
    // Project information
    projectInformation["project"] = {
      "name" : this.projectForm.value.projectName,
      "description" : this.projectForm.value.projectDesc,
      "criteria": this.projectForm.value.labellerCount
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
    
    // gets the labelTypes array
    let labelTypes = this.labelTypeToArray
    projectInformation["labelTypes"] = labelTypes;
    
    
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
      })
      .catch(error => {
        // TODO
      });
    }
     
    // else {
    //   // Make the error message red
    //   let responseObject = document.getElementById("createProjectResponse");
    //   if(responseObject != null){
    //     responseObject.style.color = 'red';
    //     }
    // }
  }

  // returns the formarray of the label types
  get labeltypes() : FormArray {
    return this.projectForm.controls["labeltypes"] as FormArray;
  }

  // Function for adding a new label type input
  addLabelType() : void {
    const labelTypeForm : FormGroup = this.formBuilder.group({
      label: ''
    });
    this.labeltypes.push(labelTypeForm);

    // To be deleted
    console.log(this.projectForm.value.projectName);
    console.log(this.projectForm.value.projectDesc);
    console.log(this.projectForm.value.labellerCount);
    console.log(this.projectForm.value.labeltypes);

    let labelTypesArray = this.labelTypeToArray();
    console.log(labelTypesArray);
  }

  // Function for removing a label type
  deleteLabelType(labelTypeIndex: number) {
    this.labeltypes.removeAt(labelTypeIndex);
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

  labelTypeToArray() : Array<string> {
    // Gets the iterator of labelTypes
    let labelTypes = this.projectForm.value.labeltypes.values();
    // Creates the new array which will will be returned
    let labelTypesArray = [];
    // Iterates over the labelTypes, adds each labeltype to the array
    for(var element of labelTypes) {
      labelTypesArray.push(element['label']);
    }
    // Returns the array
    return labelTypesArray
  }






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

