import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { Router } from '@angular/router'
import { User } from '../classes/user';
import { Project } from '../classes/project';
import { ReroutingService } from 'app/rerouting.service';

//Modal for adding users
@Component({
  selector: 'app-project-settings',
  styleUrls: ['./project-settings.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Choose the users to add to the project</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body row" *ngFor="let user of users" style="padding:2px 16px; max-height: 25px;">
        <div class="col" style="padding:15 1 1 1px; list-style: none; max-height: 25px;">
          <li> {{ user.getUsername() }}</li>
        </div>
        <!-- Col for adding users button -->
        <div class="col-2">
            <!-- Button for adding new project_members -->
            <button class="btn" type="button" id="addMembersButton" (click)="addUser(user)">
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

// Content of the modal of adding members
export class AddUsersModalContent1 {
  @Input() users: any;
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  addUser(user:User) {
    this.newItemEvent.emit(user);
  }
}

//Modal for trying to click "Add Members" while not in edit mode
@Component({
  selector: 'app-project-settings',
  styleUrls: ['./project-settings.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Action not possible</h4>
    </div>
    <div class="modal-body row" style="padding:2px 16px; max-height:55px">
        <p>You cannot add more members while in viewing mode. Click "Edit" to add more members</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})

// Content of the modal of trying to click "Add Members" while not in edit mode
export class AddUsersErrorModalContent {
  @Input() users: any;
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  addUser(user:User) {
    this.newItemEvent.emit(user);
  }
}

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})

export class ProjectSettingsComponent implements OnInit {
  //Current Project
  currentProject: Project;
  //project members
  projectMembers: User[] = [];
  //all members
  allMembers: User[] = [];
  allProjectUsers: User[] = [];
  adminMembers: Record<number,boolean> = [];
  //Arrays for different actions for users
  removedMembers: number[] = [];
  addedMembers: number[] = [];
  updatedMembers: number[] = [];

  removed: Record<number, boolean> = {};
  added: Record<number, boolean> = {};
  //label types for project
  labelTypes: string[] = [];
  //whether the page is in edit mode, default is false
  edit: boolean = false;

  constructor(private modalService: NgbModal, private router: Router, private reroutingService: ReroutingService) { 
    //Dummy data for initial
    let projectID = +(this.reroutingService.getProjectID(this.router.url));
    this.currentProject = new Project(projectID, "Project Name", "Project Description");
  }

  ngOnInit(): void {
    // Get all users within the tool
    
    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {
      const response = axios.get('http://127.0.0.1:5000/project/users', {
        headers: {
          'u_id_token': token
        }
      })
        .then(response => { 
          
          for (let user of response.data) {
            let newUser = new User(user.id, user.username);
            newUser.setEmail(user.email);
            newUser.setDescription(user.description);
            this.allMembers.push(newUser);
          }
        })
        .catch(error => {
          console.log(error);
        });

        const responseP = axios.get('http://127.0.0.1:5000/project/settings', {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id': this.currentProject.getId()
        }
      })
        .then(responseP => {
          //console.log(responseP.data);
          this.currentProject.setName(responseP.data.name);
          this.currentProject.setDescription(responseP.data.description);
          this.currentProject.setCriteria(responseP.data.criteria);
          this.currentProject.setFrozen(responseP.data.frozen);
          let users_of_project = responseP.data.users;
          for (let i = 0; i < users_of_project.length; i++) {
            this.projectMembers.push(new User(users_of_project[i].id, users_of_project[i].username));
            this.allProjectUsers.push(new User(users_of_project[i].id, users_of_project[i].username));
            this.adminMembers[users_of_project[i].id] = users_of_project[i].admin;
          }
          this.currentProject.setUsers(this.projectMembers);
          let labeltypes_of_project = responseP.data.labelType;
          for (let i = 0; i < labeltypes_of_project.length; i++) {
            this.labelTypes.push(labeltypes_of_project[i].label_type_name);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  getAdmin(user: User) {
    let projMembers = this.currentProject.getUsers();
    if( projMembers != undefined ) {
      return this.adminMembers[projMembers.indexOf(user)];
    }
    else {
      return 0;
    }
  }

  getUpdatedUsers() {
    for (let i = 0; i < this.projectMembers.length; i++) {
      if (!this.addedMembers.includes(this.projectMembers[i].getId())){
        this.removed[this.projectMembers[i].getId()] = false; 
        this.updatedMembers.push(this.projectMembers[i].getId());
      }
    }
  }

  //Entering Edit Mode
  clickEdit(): void {
    this.edit = true;
  }

  //Exiting Editing Mode
  unclickEdit(): void {
    this.edit = false;
  }

  //Saving changes made to project
  async saveEdit(): Promise<void> {
    //Setting name, description, criteria
    this.getUpdatedUsers();
    this.currentProject.setName((<HTMLInputElement>document.getElementById("projectName")).value);
    this.currentProject.setDescription((<HTMLInputElement>document.getElementById("projectDescriptionForm")).value);
    this.currentProject.setCriteria(+(<HTMLInputElement>document.getElementById("numberOfLabellers")).value);
    this.currentProject.setUsers(this.projectMembers);
    //Change back to non-edit view
    this.edit = false;
    //Check the checkboxes
    for (let i = 0; i < this.projectMembers.length; i++) {
      let adminBool = (<HTMLInputElement>document.getElementById("projectAdminCheckBox-" + this.projectMembers[i].getId())).checked; 
      //Assign the values of the checkboxes according to whether they have been checked during edit mode
      this.adminMembers[this.projectMembers[i].getId()] = adminBool;
    }

    // Way to get information to backend
    let projectInformation: Record<string, any> = {};
    // Project information
    projectInformation["project"] = {
      "id": this.currentProject.getId(),
      "name" : this.currentProject.getName(),
      "description" : this.currentProject.getDescription(),
      "criteria": this.currentProject.getCriteria(),
      "frozen": this.currentProject.getFrozen()
    };
    //All project users
    let updateInfo: Record<string,any> = {};
    this.allProjectUsers.forEach(user => {
      updateInfo[user.getId()] = {
        "removed": this.removed[user.getId()],
        "admin": this.adminMembers[user.getId()]
      }
    });
    console.log(updateInfo);

    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {        
      // Send the data to the database
      const response =  await axios.patch('http://127.0.0.1:5000/project/edit', projectInformation["project"], {
        headers: {
          'u_id_token': token
        }
      })
      .then(response => { 
        // TODO
        console.log("Done")
        return Math.floor(response.status/100) == 2;
      })
      .catch(error => {
        // TODO
        return;
      });
    }
  }

  //testing method for placeholder
  test(): void{ 
  }

  addMember(user: User, admin: boolean) {
    if (this.removedMembers.includes(user.getId())) {
      this.removedMembers.splice(this.removedMembers.indexOf(user.getId()),1);
      this.projectMembers.push(user);
      this.adminMembers[user.getId()] = admin;
    }
    else {
      this.allProjectUsers.push(user);
      this.added[user.getId()] = true;
      this.projectMembers.push(user);
      this.adminMembers[user.getId()] = admin;
      this.addedMembers.push(user.getId());
    }
  }

  removeMember(user: User) {
    if (this.addedMembers.includes(user.getId())) {
      this.allProjectUsers.splice(this.allProjectUsers.indexOf(user),1);
      this.addedMembers.splice(this.addedMembers.indexOf(user.getId()),1);
      let index = this.projectMembers.indexOf(user);
      this.projectMembers.splice(index,1);
      this.adminMembers[user.getId()] = false;
    }
    else {
      let index = this.projectMembers.indexOf(user);
      this.removed[user.getId()] = true;
      this.projectMembers.splice(index,1);
      this.adminMembers[user.getId()] = false;
      this.removedMembers.push(user.getId());
    }
  }

  // Open the modal for adding users and populate it with users
  openAdd() {
    const modalRef = this.modalService.open(AddUsersModalContent1);
    modalRef.componentInstance.users = this.allMembers;
    // Push the username into the members list 
    modalRef.componentInstance.newItemEvent.subscribe(($e: User) => {
      var user = $e;
      //  Checks if the user is already added
      if(!this.projectMembers.some(e => e.getUsername() === user.getUsername())){
        // If not, we add them
        this.addMember(user, false);
      }
    })
  }

  // Open the modal for adding error
  openAddError() {
    const modalRef = this.modalService.open(AddUsersErrorModalContent);
  }

  //Freezing the project
  async freezeProject(): Promise<void> {
    this.currentProject.setName(this.currentProject.getName() + "- FROZEN");
    this.edit = false;
    this.currentProject.setFrozen(true);
    this.sendFreezeToBackend(this.currentProject.getId(), this.currentProject.getFrozen());
  }

  //Unfreezing the project
  unfreezeProject() {
    let newName = this.currentProject.getName().substring(0,this.currentProject.getName().indexOf("- FROZEN"));
    this.currentProject.setName(newName);
    this.currentProject.setFrozen(false);
    this.sendFreezeToBackend(this.currentProject.getId(), this.currentProject.getFrozen());
  }

  async sendFreezeToBackend(projectId: number, projectFrozen: any): Promise<void> {
    // Way to get information to backend
    let projectInformation: Record<string, any> = {};
    // Project information
    projectInformation["project"] = {
      "id": projectId,
      "frozen": projectFrozen
    };

    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {        
      // Send the data to the database
      const response =  await axios.patch('http://127.0.0.1:5000/project/freeze', projectInformation["project"], {
        headers: {
          'u_id_token': token
        }
      })
      .then(response => { 
        // TODO
        console.log("Done")
        return Math.floor(response.status/100) == 2;
      })
      .catch(error => {
        // TODO
        return;
      });
    }
  }
}
