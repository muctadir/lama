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
      <div id="overflow-modal">
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

  /**
   * Initializes the modal
   * 
   * @param activeModal instance of NgbActiveModal
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Function which emits the user clicked on by the user
   * 
   * @param user that has been clicked on
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

  /* FormGroup which will hold the different information of the project */
  projectForm : FormGroup = this.formBuilder.group({
    projectName: '',
    projectDesc: '',
    labellerCount: 2,
    // Array containing the different label types
    labeltypes: this.formBuilder.array([])
  });

  /**
   * Initializes the modal, router and formbuilder
   * @param modalService instance of modal
   * @param router instance of router
   * @param formBuilder instance of formbuilder
   */
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
   * 
   * TODO: Use the request factory to make the axios request
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

  /**
   * Responsible for creating a new project. Gathers the data from the various forms,
   * creates a projectInformation record holding this information, which is then send to
   * the backend for creation. 
   * 
   * @trigger Create project button is clicked
   */
  createProject() : void { 
    // Creates object which will be returned to the backend
    let projectInformation: Record<string, any> = {};
    // Adds the projectname, project description and nr of labellers to the object
    projectInformation["project"] = {
      "name" : this.projectForm.value.projectName,
      "description" : this.projectForm.value.projectDesc,
      "criteria": this.projectForm.value.labellerCount
    };
    
    // Adds the users of the project to the object
    this.addUsers(projectInformation)
    
    // Gets the array containing the different label types
    let labelTypes = this.labelTypeToArray();
    // Adds the labeltypes to the object
    projectInformation["labelTypes"] = labelTypes;

    // Calls function responsible for making the project creation request
    this.makeRequest(projectInformation);
  }

  /**
   * Makes the project creation request to the backend
   * 
   * @param projectInformation Record holding the different parameters of the project to be created
   * @trigger Create project button is clicked
   * 
   * TODO: Use the request factory to make the axios request
   */
  makeRequest(projectInformation: Record<string, any> ) : void {
    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {        
      // Send the data to the database
      axios.post('http://127.0.0.1:5000/project/creation', projectInformation, {
        headers: {
          'u_id_token': token
        }
      })
      .then(() => { 
        // Navigates the user back to the home page
        this.router.navigate(["/home"]);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  /**
   * Adds the users which the user has selected to add to the new project
   * to the projectInformation, so that the backend knows which users to add.
   * 
   * @param projectInformation Record holding the project information
   * @modifies projectInformation
   */
  addUsers(projectInformation : Record<string, any>) : void {
    // Users within the project
    projectInformation["users"] = []

    // For each user get the admin status
    for(let i=0; i< this.projectMembers.length; i++) {
      // Boolean indicating whether the user is an admin
      let admin: boolean = false;
      let adminCheckbox = document.getElementById("projectAdminCheckBox-" + this.projectMembers[i].getUsername()) as HTMLInputElement;
      if (adminCheckbox != null) {
        admin = adminCheckbox?.checked;
      }
      // Push the user ids and admin status to list
      projectInformation["users"].push({
        "u_id": this.projectMembers[i].getId(),
        "admin": admin
      })
    }
  }

  /**
   * Getter function returning the FormArray of the label types
   * 
   * @returns FormArray with the different label types
   */
  get labeltypes() : FormArray {
    return this.projectForm.controls["labeltypes"] as FormArray;
  }

  /**
   * Function creating a new label type, and put this in the projectForm.
   * 
   * @modifies projectForm
   */
  addLabelType() : void {
    // Create the new formGroup
    const labelTypeForm : FormGroup = this.formBuilder.group({
      label: ''
    });
    // Adds the formGroup to the formArray containing the different label types.
    this.labeltypes.push(labelTypeForm);
  }

  /**
   * Function responsible for removing the labeltype at index: labelTypeIndex 
   * from the formArray of label types
   * 
   * @param labelTypeIndex the index of the label type which should be removed
   * @trigger remove button of the labelTypeIndex is clicked
   */
  deleteLabelType(labelTypeIndex: number) : void {
    this.labeltypes.removeAt(labelTypeIndex);
  }

  /**
   * Transforms the formArray of the labeltypes into a regular array.
   * So that it can be used in the request to the backend.
   * 
   * @returns Array containing the different labeltypes.
   * @trigger Create project button is clicked
   */
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

  /**
   * Removes a member from the list of members to be added to the project
   * 
   * @param id the id of the member that should be removed from the project
   * @modifes projectMembers
   */
  removeMember(id:any){
    // Go through all members
    this.projectMembers.forEach((projectMembers, index)=>{
      // If clicked cross matches the person, splice them from the members
      if(projectMembers.getUsername()==id){
        this.projectMembers.splice(index,1);
      }
    });    
  }

  /**
   * Opens the add user modal, and displays all the users in the application in the modal.
   * 
   * @modifies projectMembers
   */
  open() : void {
    // opens the AddUsersModal
    const modalRef = this.modalService.open(AddUsersModalContent);

    // passes all the users in the application to the modal
    modalRef.componentInstance.users = this.allMembers;

    // Push the username into the members list 
    modalRef.componentInstance.newItemEvent.subscribe(($e: User) => {
      let user = $e;

      //  Checks if the user is already added
       if(!this.projectMembers.some(e => e.getUsername() === user.getUsername())){
         // If not, we add them
        this.projectMembers.push(user);
       }
    })
  }

 }

