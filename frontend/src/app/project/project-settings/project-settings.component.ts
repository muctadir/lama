//Linh Nguyen

import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { User } from 'app/classes/user';
import { Project } from 'app/classes/project';
import { ReroutingService } from 'app/services/rerouting.service';
import { EditModeService } from 'app/services/edit-mode.service';
import { AddUsersModalComponent } from 'app/modals/add-users-modal/add-users-modal.component';
import { RequestHandler } from 'app/classes/RequestHandler';
import { ToastCommService } from 'app/services/toast-comm.service';

/* Project settings component */
@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})

export class ProjectSettingsComponent implements OnInit {
  /* Current project */
  currentProject: Project;

  /* Current user ID */
  currentUserId: number = 0;

  /* Super admin ID */
  superAdminID: number = 0;

  /* Array of current members of the project */
  projectMembers: User[] = [];

  /* Array of all members of the system */
  allMembers: User[] = [];

  /* Dictionary containing all members of the project (old and current), with the key being the member's ID */
  allProjectMembers: Record<number, User> = {};

  /* Dictionary containing admin status of all members of the project (old and current), with the key being the member's ID */
  adminMembers: Record<number, boolean> = [];

  /* Dictionary containing removed status of all members of the project (old and current), with the key being the member's ID */
  removed: Record<number, any> = {};

  /* Dictionary containing added members of the project in an edit session, with the key being the member's ID */
  added: Record<number, any> = {};
  /* Dictionary containing removed members of the project in an edit session, with the key being the member's ID */
  removedMembers: Record<number, any> = {};

  /* Array of label types for project */
  labelTypes: string[] = [];
  /* Boolean showing if the page is in edit mode, default is false */
  isInEditMode: boolean = false;

  /* FormGroup which will hold the different information of the project */
  projectForm : FormGroup;

  /**
   * Initializes the modal, router, rerouting service and formbuilder
   * @param modalService instance of modal
   * @param router instance of router
   * @param reroutingService instance of rerouting service
   * @param formBuilder instance of formbuilder
   */
  constructor(private modalService: NgbModal, 
    private router: Router, 
    private reroutingService: ReroutingService,
    private formBuilder: FormBuilder, 
    private editModeService: EditModeService,
    private toastCommService: ToastCommService) {
    //Initiliazing project with the retrieved project ID from URL
    let projectID = +(this.reroutingService.getProjectID(this.router.url));
    this.currentProject = new Project(projectID, "Project Name", "Project Description");
    this.projectForm = this.formBuilder.group({
        projectName: "",
        projectDesc: "",
        numberOfLabellers: 2,
      })
    //Setting edit mode to value
    this.editModeService.isInEditMode.subscribe( value => {
      this.isInEditMode = value;
    })
  }

  /**
   * Gets all the users within the application from the backend
   * Stores the users in the allMembers array
   * Gets project information from the backend
   * Store the project in currentProject
   *
   * @modifies allMembers, currentProject
   * @trigger on creation of component
   */
  ngOnInit(): void {

    // Gets the authentication token from the session storage
    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {
      // Get all users within the tool
      this.requestUsers(token);
      //Get information about current project
      this.requestCurrentProject(token);
    }
  }

  /**
   * Gets all the users in the application from the backend
   *
   * @param token used for authenticating the user to the backend
   *
   * @trigger on component load
   * @modifies allMembers
   */
   async requestUsers(token : string | null) : Promise<void> {
    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);

    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      let response: any = requestHandler.get("/project/users", {}, true);

      // Waits on the request
      let result = await response;

      // Loops over the response of the server and parses the response into the allMembers array
      for (let user of result) {
        // creates the object
        let newUser = new User(user.id, user.username);
        // passes additional data to the newly created user object
        newUser.setEmail(user.email);
        newUser.setDesc(user.description);
        // pushes the new user to the array of all users
        this.allMembers.push(newUser);
      }
    } catch(e) {
      // Emits an error toast
      this.toastCommService.emitChange([false, "An error occured when loading data from the server"]);
    }
  }

  /**
   * Gets infromation from current project from the backend
   *
   * @param token used for authenticating the user to the backend
   *
   * @modifies currentProject, projectMembers, allProjectMembers, adminMembers, removed
   */
   async requestCurrentProject(token : string | null) : Promise<void> {
    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);

    // Makes the request and handles response
    try {
      // Makes the request to the backend for current project information
      let response: any = requestHandler.get("/project/settings", {'p_id': this.currentProject.getId()}, true);

      // Waits on the request
      let result = await response;

      //Setting user ID
      this.currentUserId = result.u_id

      //Setting project name, description, criteria, and frozen status
      this.setCurrenProjectInfo(result.name, result.description, result.criteria, result.frozen, undefined)

      //Setting project users
      let members_of_project = result.users;
      for (let i = 0; i < members_of_project.length; i++) {
        //Adding only current members of the project to projectMembers
        if (members_of_project[i].removed != 1) {
          this.projectMembers.push(new User(members_of_project[i].id, members_of_project[i].username));
        }
        //Setting the super admin ID
        if (members_of_project[i].super_admin == true) {
          this.superAdminID = members_of_project[i].id;
        }
        //Adding all members (old and current) of the project to allProjectMembers
        this.allProjectMembers[members_of_project[i].id] = new User(members_of_project[i].id, members_of_project[i].username);
        //Setting admin status of all members
        this.adminMembers[members_of_project[i].id] = members_of_project[i].admin;
        //Setting removed status of all members
        this.removed[members_of_project[i].id] = +(members_of_project[i].removed);
      }
      //Setting current project's member list
      this.currentProject.setUsers(this.projectMembers);

      //Setting current project's label types list
      let labeltypes_of_project = result.labelType;
      for (let i = 0; i < labeltypes_of_project.length; i++) {
        this.labelTypes.push(labeltypes_of_project[i].label_type_name);
      }

      //Setting values of the forms based on the current project's existing information
      this.projectForm.setValue({
        projectName: this.currentProject.getName(),
        projectDesc: this.currentProject.getDesc(),
        numberOfLabellers: this.currentProject.getCriteria(),
      })
    } catch(e) {
      // Emits an error toast
      this.toastCommService.emitChange([false, "An error occured when loading data from the server"]);
    }
  }

  /**
   * Sends (updated) information about the project and its members to the backend
   *
   * @param token used for authenticating the user to the backend
   * @param sendingInfo used for the information to be sent to the backend
   *
   * @modifies currentProject, projectMembers, allProjectMembers, removed
   */
  async sendUpdateRequest(token : string | null, sendingInfo: any) : Promise<void> {
    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);

    try {
      // Makes the request and handles response
      // Makes the request to the backend for current project information
      let response: any = requestHandler.patch("/project/edit",
      {'p_id': this.currentProject.getId(), 'project': sendingInfo["project"],
       'add': sendingInfo["add"], 'update': sendingInfo["update"]}, true);

      // Waits on the request
      let result = await response;
      if (result == "Ok") {
        //Reinitializing for next edit task
        for (let key in this.allProjectMembers) {
          //If the member is added to the project but has previously been part of this project already
          if (this.allProjectMembers[key].getId() in this.added && this.removed[this.allProjectMembers[key].getId()] == 1) {
            //Change their removed status to 0 - the user is now part of the project
            this.removed[this.allProjectMembers[key].getId()] = 0;
          }
        }
        //Reinitializing arrays for next editing
        this.removedMembers = [];
        this.added = [];
      }
      this.toastCommService.emitChange([true, "Edit successful"]);
    }
    catch {
      // Emits an error toast
      this.toastCommService.emitChange([false, "An error occured when loading data from the server"]);
    }
  }

  /**
   * Entering edit mode on frontend
   */
  clickEdit(): void {
    this.editModeService.isInEditMode.next(true);
  }

  /**
   * Exiting edit mode on frontend
   */
  unclickEdit(): void {
    //Change back to non-edit view
    this.editModeService.isInEditMode.next(false);
    //Reinitializing arrays and original user list
    this.projectMembers = [];
    this.labelTypes = [];
    this.allMembers = [];
    this.ngOnInit();
  }

  /**
   * Responsible for editing project information. Gathers the data from the various forms,
   * creates a projectInformation record holding this information, which is then send to
   * the backend for editing.
   *
   * @trigger "Save" button is clicked
   */
  async saveEdit(): Promise<void> {
    //Setting name, description, criteria, users and their admin status
    this.setCurrenProjectInfo(this.projectForm.value.projectName, this.projectForm.value.projectDesc,
    this.projectForm.value.numberOfLabellers, false, this.projectMembers);
    //Change back to non-edit view
    this.editModeService.isInEditMode.next(false);

    // Way to get information to backend
    let projectInformation: Record<string, any> = {};
    // Project information to be updated
    projectInformation["project"] = {
      "id": this.currentProject.getId(),
      "name" : this.currentProject.getName(),
      "description" : this.currentProject.getDesc(),
      "criteria": this.currentProject.getCriteria(),
      "frozen": this.currentProject.getFrozen()
    };

    //Dictionary with all updated project users (users with updated admin statuses and removed members)
    let updateInfo: Record<string,any> = {};
    //Dictionary with all added project users
    let addedInfo: Record<string,any> = {};
    for (let key in this.allProjectMembers) {
      let userInfo = {
        "id": this.allProjectMembers[key].getId(),
        "name": this.allProjectMembers[key].getUsername(),
        "removed": this.removed[this.allProjectMembers[key].getId()],
        "admin": +(this.adminMembers[this.allProjectMembers[key].getId()])
      }
      //If users are not newly added, they are "updated" (even if no information is added)
      if (!(this.allProjectMembers[key].getId() in this.added)) {
        updateInfo[this.allProjectMembers[key].getId()] = userInfo;
      }
      else {
        //If users are newly added, they are "added"
        addedInfo[this.allProjectMembers[key].getId()] = userInfo;
      }
    }

    //Add updated members and added members to projectInformation to send to backend
    projectInformation["update"] = updateInfo;
    projectInformation["add"] = addedInfo;

    //Getting authenticating token
    let token: string | null  = sessionStorage.getItem('ses_token');
    //Sending update to the backend
    this.sendUpdateRequest(token, projectInformation);
  }

  /**
   * Assigning project information to the object currentProject.
   *
   * @param name string with the name of the project
   * @param desc string with description of project
   * @param criteria number of labellers that labels needed to be considered completed
   * @param frozen frozen status of the project
   * @param users list of users that are a part of this project
   *
   * @modifies currentProject, adminMembers
   */
  setCurrenProjectInfo(name: string, desc: string, criteria: number, frozen: boolean, users: User[] | undefined) : void {
    //Setting name, description, criteria
    this.currentProject.setName(name);
    this.currentProject.setDesc(desc);
    this.currentProject.setCriteria(+(criteria));
    this.currentProject.setFrozen(frozen);
    if (this.currentProject.getFrozen()) {
      this.editModeService.isInEditMode.next(false);
    }
    if (users != undefined) {
      this.currentProject.setUsers(users);
      //Check the checkboxes for all users
      for (let i = 0; i < this.projectMembers.length; i++) {
        let adminBool = (<HTMLInputElement>document.getElementById("projectAdminCheckBox-" + this.projectMembers[i].getId())).checked;
        //Assign the values of the checkboxes according to whether they have been checked during edit mode
        this.adminMembers[this.projectMembers[i].getId()] = adminBool;
      }
    }
  }

  /**
   * Add members to the project on the frontend.
   *
   * @param user user to be added to project
   * @param admin admin status of the member to be added
   *
   * @modifies projectMembers, adminMembers, removed, added, allProjectMembers
   */
  addMember(user: User, admin: boolean) {
    // If user is previously removed (from the front end, not yet in the back end)
    if (user.getId() in this.removedMembers) {
      // Remove them from the removed members list
      delete this.removedMembers[user.getId()]
      // Change the user's removed status
      this.removed[user.getId()] = 0
    }
    else {
      //Add user to list of project members (old and current)
      this.allProjectMembers[user.getId()] = user;
      //Add user to list of newly added users
      this.added[user.getId()] = 1;
      //If user has never been a part of the project
      if (!(user.getId() in this.removed)) {
        //Add them to the removed status dictionary
        this.removed[user.getId()] = 0;
      }
    }
    //Push user back into project members list
    this.projectMembers.push(user);
    //Assigning the admin status to the user
    this.adminMembers[user.getId()] = admin;
    this.toastCommService.emitChange([true, "User added"])
  }

  /**
   * Remove members from the project on the frontend.
   *
   * @param user user to be added to project
   *
   * @modifies projectMembers, adminMembers, removed, added, allProjectMembers, removedMembers
   */
  removeMember(user: User) {
    //If user is previously added (in the front end, not yet in the back end)
    if (user.getId() in this.added) {
      //Remove user from list of project members (old and current)
      delete this.allProjectMembers[user.getId()]
      //Remove user from list of newly added users
      delete this.added[user.getId()]
      //Remove user from project members list
      let index = this.projectMembers.indexOf(user);
      this.projectMembers.splice(index,1);
      //Remove user as admin from admin status dictionary
      this.adminMembers[user.getId()] = false;
    }
    else {
      // Assign removed status to user
      this.removed[user.getId()] = 1;
      // Add user to list of users that have been removed from project
      this.removedMembers[user.getId()] = user
    }
    // Remove user from project members list
    let index = this.projectMembers.indexOf(user);
    this.projectMembers.splice(index,1);
    // Remove user as admin from admin status dictionary
    this.adminMembers[user.getId()] = false;
  }

  /**
   * Opens the add user modal, and displays all the users in the application in the modal.
   *
   * @modifies projectMembers
   */
   open() : void {
    // opens the AddUsersModal
    const modalRef = this.modalService.open(AddUsersModalComponent);

    // passes all the users in the application to the modal
    modalRef.componentInstance.users = this.allMembers;

    // Push the username into the members list
    modalRef.componentInstance.addUserEvent.subscribe(($e: User) => {
      let user = $e;

      //  Checks if the user is already added
       if(!this.projectMembers.some(e => e.getUsername() === user.getUsername())){
         // If not, we add them
        this.addMember(user, false);
       }
    })
  }

  /**
   * Change the frozen status of the project.
   *
   * @param frozenStatus frozen status of the project
   * @param editMode edit mode of the project
   *
   * @trigger Button "Freeze" or "Unfreeze" is clicked
   */
  changeFreezeProject(frozenStatus: boolean, editMode: boolean): void {
    //Getting authenticating token
    let token: string | null  = sessionStorage.getItem('ses_token');
    //Setting project's frozen status to true, and go back to non-edit mode
    this.currentProject.setFrozen(frozenStatus);
    this.editModeService.isInEditMode.next(editMode);
    //Update the frozen status to the back-end
    this.sendFreezeRequest(token, {"p_id": this.currentProject.getId(),"frozen": frozenStatus});
  }

  /**
   * Sends (updated) information about the project's frozen status to the backend
   *
   * @param token used for authenticating the user to the backend
   * @param sendingInfo used for the information to be sent to the backend
   *
   * @modifies currentProject, projectMembers, allProjectMembers, removed
   */
  async sendFreezeRequest(token: string | null, sendingInfo: any): Promise<void> {
    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);
    try {
      // Makes the request and handles response
      // Makes the request to the backend for current project information
      let response: any = requestHandler.patch("/project/freeze", {'p_id': sendingInfo["p_id"], 'frozen': sendingInfo["frozen"]}, true);

      // Waits on the request
      let result = await response;
      if (result == "Ok") {
        // Emits an error toast
        this.toastCommService.emitChange([true, "Success"]);
      }
    }
    catch {
      // Emits an error toast
      this.toastCommService.emitChange([false, "An error occured when loading data from the server"]);
    }
  }
}
