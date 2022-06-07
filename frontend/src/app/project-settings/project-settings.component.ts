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
export class AddUsersModalContent {
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
  adminMember: boolean[] = [];
  //label types for project
  labelTypes: string[] = [];
  //whether the page is in edit mode, default is false
  edit: boolean = false;

  constructor(private modalService: NgbModal, private router: Router, private reroutingService: ReroutingService) { 
    //Dummy data for initial
    let projectID = +(this.reroutingService.getProjectID(this.router.url));
    this.currentProject = new Project(projectID, "Project Name", "Project Description");
    this.labelTypes.push("Material");
    this.labelTypes.push("Lamas");
    this.labelTypes.push("Test");
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

        const responseP = axios.get('http://127.0.0.1:5000/project/home', {
        headers: {
          'u_id_token': token
        }
      })
        .then(responseP => {
          //console.log(responseP.data);
          this.currentProject.setName(responseP.data[this.currentProject.getId()-1].project.name);
          this.currentProject.setDescription(responseP.data[this.currentProject.getId()-1].project.description);
          this.currentProject.setCriteria(responseP.data[this.currentProject.getId()-1].project.criteria);
          this.currentProject.setFrozen(responseP.data[this.currentProject.getId()-1].project.frozen);
          let thisProjectUsers = responseP.data[this.currentProject.getId()-1];
          console.log(thisProjectUsers);
          for (let i = 0; i < thisProjectUsers.projectUsers.length; i++) {
            this.projectMembers.push(new User(thisProjectUsers.projectUsers[i].id, thisProjectUsers.projectUsers[i].username));
          }
        })
        .catch(error => {
          console.log(error);
        });
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
    this.currentProject.setName((<HTMLInputElement>document.getElementById("projectName")).value);
    this.currentProject.setDescription((<HTMLInputElement>document.getElementById("projectDescriptionForm")).value);
    this.currentProject.setCriteria(+(<HTMLInputElement>document.getElementById("numberOfLabellers")).value);
    // For with the label types
    const post_form3: HTMLFormElement = (document.querySelector("#labelTypeForm")!);
    this.labelTypes = this.getLabelTypes(post_form3);
    //Change back to non-edit view
    this.edit = false;
    //Check the checkboxes
    for (let i = 0; i < this.projectMembers.length; i++) {
      let adminBool = (<HTMLInputElement>document.getElementById("projectAdminCheckBox-" + this.projectMembers[i].getId())).checked; 
      //Assign the values of the checkboxes according to whether they have been checked during edit mode
      this.adminMember[i] = adminBool;
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
  //Getting label types from form
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

  //testing method for placeholder
  test(): void{ 
  }

  // Open the modal for adding users and populate it with users
  openAdd() {
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
