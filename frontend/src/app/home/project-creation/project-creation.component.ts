// Victoria Bogachenkova
// Veerle Fürst
// Jarl Jansen

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/classes/user';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { InputCheckService } from 'app/services/input-check.service';
import { AddUsersModalComponent } from 'app/modals/add-users-modal/add-users-modal.component';
import { ProjectDataService } from 'app/services/project-data.service';
import { ToastCommService } from 'app/services/toast-comm.service';

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
  projectForm: FormGroup = this.formBuilder.group({
    projectName: '',
    projectDesc: '',
    labellerCount: 2,
    // Array containing the different label types
    labeltypes: this.formBuilder.array([])
  });

  /**
   * Initializes the modal, router, formbuilder, toastcommservice, inputCheckService
   * 
   * @param modalService instance of modal
   * @param router instance of router
   * @param formBuilder instance of formbuilder
   * @param toastCommService instance of ToastCommService
   * @param service instance of InputCheckService
   */
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder,
    private projectDataService: ProjectDataService,
    private toastCommService: ToastCommService,
    private service: InputCheckService) { }

  /**
   * Gets all the users within the application from the backend
   * Stores the users in the allMembers array
   * 
   * @modifies allMembers
   * @trigger on creation of component
   */
  ngOnInit(): void {
    // Get all users within the tool
    this.getUsers();
  }

  /**
   * Gets all the users from project-data.service
   * 
   */
  async getUsers(): Promise<void> {
    const allMembers = await this.projectDataService.getUsers();
    this.allMembers = allMembers;
  }

  /**
   * Responsible for creating a new project. Gathers the data from the various forms,
   * creates a projectInformation record holding this information, which is then send to
   * the backend for creation. 
   * 
   * @trigger Create project button is clicked
   */
  async createProject(): Promise<void> {
    // Creates object which will be returned to the backend
    let projectInformation: Record<string, any> = {};
    // Adds the projectname, project description and nr of labellers to the object
    projectInformation["project"] = {
      "name": this.projectForm.value.projectName,
      "description": this.projectForm.value.projectDesc,
      "criteria": this.projectForm.value.labellerCount
    };

    // Adds the users of the project to the object
    this.addUsers(projectInformation)

    // Gets the array containing the different label types
    let labelTypes = this.labelTypeToArray();
    // Adds the labeltypes to the object
    projectInformation["labelTypes"] = labelTypes;

    // Checks whether the use input is correct
    if (this.checkProjectData(projectInformation)) {
      try {
        // Calls function responsible for making the project creation request
        await this.projectDataService.makeRequest(projectInformation);
        // Emits a success toast
        this.toastCommService.emitChange([true, "Project created sucessfully"]);
        // Navigates the user back to the home page
        this.router.navigate(["/home"]);
      } catch (e: any) {
        // Check if the error has invalid characters
        if (e.response.status == 511) {
          // Displays the error message
          this.toastCommService.emitChange([false, "Input contains a forbidden character: \\ ; , or #"]);
        } else if (e.response.data == "Input contains leading or trailing whitespaces") {
          // Displays the error message
          this.toastCommService.emitChange([false, "Input contains leading or trailing whitespaces"]);
        } else {
          // Emits an error toast
          this.toastCommService.emitChange([false, "An error occured while creating the theme"]);
        }
      }
    } else {
      // Emits an error toast
      this.toastCommService.emitChange([false, "Please fill in all input fields!"]);
    }
  }

  /**
   * Checks whether the project has a name, a description and at least 1 label type, 
   * and whether each label type has a name
   * 
   * @param projectInformation the project data that we will use to check these requirements
   * @returns whether the info satisfies these requirements
   */
  checkProjectData(projectInformation: Record<string, any>): boolean {
    // Checks whether the project name/description is non-empty
    let checkFilled: boolean = this.service.checkFilled(projectInformation["project"]["name"]) &&
      this.service.checkFilled(projectInformation["project"]["description"])

    // checks whether the number of labeltypes is greater than 0
    let moreThanOneLabelType: boolean = projectInformation["labelTypes"].length > 0;

    // Checks whether all label types are non-empty
    let labelFilled: boolean = true;
    for (const labeltype of projectInformation["labelTypes"]) {
      if (!this.service.checkFilled(labeltype)) {
        labelFilled = false;
      }
    }

    // Returns true if project name, project desc, label types are all non empty.
    return checkFilled && labelFilled && moreThanOneLabelType;
  }


  /**
   * Adds the users which the user has selected to add to the new project
   * to the projectInformation, so that the backend knows which users to add.
   * 
   * @param projectInformation Record holding the project information
   * @modifies projectInformation
   */
  addUsers(projectInformation: Record<string, any>): void {
    // Users within the project
    projectInformation["users"] = []

    // For each user get the admin status
    for (let projectMember of this.projectMembers) {
      // Boolean indicating whether the user is an admin
      let admin: boolean = false;
      let adminCheckbox = document.getElementById("projectAdminCheckBox-" + projectMember.getUsername()) as HTMLInputElement;
      if (adminCheckbox != null) {
        admin = adminCheckbox?.checked;
      }
      // Push the user ids and admin status to list
      projectInformation["users"].push({
        "u_id": projectMember.getId(),
        "admin": admin
      })
    }
  }

  /**
   * Getter function returning the FormArray of the label types
   * 
   * @returns FormArray with the different label types
   */
  get labeltypes(): FormArray {
    return this.projectForm.controls["labeltypes"] as FormArray;
  }

  /**
   * Function creating a new label type, and put this in the projectForm.
   * 
   * @modifies projectForm
   */
  addLabelType(): void {
    // Create the new formGroup
    const labelTypeForm: FormGroup = this.formBuilder.group({
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
  deleteLabelType(labelTypeIndex: number): void {
    this.labeltypes.removeAt(labelTypeIndex);
  }

  /**
   * Transforms the formArray of the labeltypes into a regular array.
   * So that it can be used in the request to the backend.
   * 
   * @returns Array containing the different labeltypes.
   * @trigger Create project button is clicked
   */
  labelTypeToArray(): Array<string> {
    // Gets the iterator of labelTypes
    let labelTypes = this.projectForm.value.labeltypes.values();
    // Creates the new array which will will be returned
    let labelTypesArray = [];
    // Iterates over the labelTypes, adds each labeltype to the array
    for (var element of labelTypes) {
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
  removeMember(member: any): void {
    // Go through all members
    this.projectMembers.forEach((projectMember, index) => {
      // If clicked cross matches the person, splice them from the members
      if (projectMember == member) {
        // Remove the person from the project members
        this.projectMembers.splice(index, 1);
        // Add the person to all members
        this.allMembers.push(member);
      }
    });
  }

  /**
   * Opens the add user modal, and displays all the users in the application in the modal.
   * 
   * @modifies projectMembers
   */
  open(): void {
    // opens the AddUsersModal
    const modalRef = this.modalService.open(AddUsersModalComponent);

    // passes all the users in the application to the modal
    modalRef.componentInstance.users = this.allMembers;

    // Push the username into the members list 
    modalRef.componentInstance.addUserEvent.subscribe(($e: User) => {
      let user = $e;

      // Checks if the user is already added
      if (!this.projectMembers.some(e => e.getUsername() === user.getUsername())) {
        // If not, we add them
        this.projectMembers.push(user);
      }

      // Remove user from all users
      this.allMembers.splice(this.allMembers.indexOf(user), 1)
    })
  }

}