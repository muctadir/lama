import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user';

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
  //project name
  projectName: string = "project name";
  //project description
  projectDesc: string = "project description";
  //project members
  projectMembers: User[] = [];
  //all members
  allMembers: User[] = [];
  adminMember: boolean[] = [];
  //label criteria for project
  labelCount: string = "2";
  //label types for project
  labelTypes: string[] = [];
  //whether the page is in edit mode, default is false
  edit: boolean = false;

  constructor(private modalService: NgbModal) { 
    //Dummy data for initial
    this.projectMembers.push(new User(1, "Linh", "notmail@com.com","They cool"));
    this.projectMembers.push(new User(2, "Jarl", "notmail@com.com","They cool"));
    this.projectMembers.push(new User(3, "Vic", "notmail@com.com","They cool"));
    this.projectMembers.push(new User(4, "Thea", "notmail@com.com","They cool"));
    //(<HTMLInputElement>document.getElementById("projectAdminCheckBoxHome-" + this.projectMembers[0].getId())).checked = true;
    //this.allMembers = this.projectMembers;
    this.allMembers.push(new User(5, "Veerle", "notmail@com.com", "They cool"))
    this.allMembers.push(new User(6, "Chinno", "notmail@com.com", "They cool"))
    this.allMembers.push(new User(6, "Bartjan", "notmail@com.com", "They cool"))
  }

  ngOnInit(): void {
  }

  //Entering Edit Mode
  clickEdit(): void {
    this.edit = true;
  }

  //Exiting Editing Mode
  unclickEdit(): void {
    this.edit = false;
  }

  //Adding a label type
  addLabelType(): void {
    this.labelTypes.push("");
  }

  //Saving changes made to project
  saveEdit(): void {
    this.projectName = (<HTMLInputElement>document.getElementById("projectName")).value;
    this.projectDesc = (<HTMLInputElement>document.getElementById("projectDescriptionForm")).value;
    this.labelCount = (<HTMLInputElement>document.getElementById("numberOfLabellers")).value;
    // For with the label types
    const post_form3: HTMLFormElement = (document.querySelector("#labelTypeForm")!);
    this.labelTypes = this.getLabelTypes(post_form3);
    this.edit = false;
    for (let i = 0; i < this.projectMembers.length; i++) {
      let adminBool = (<HTMLInputElement>document.getElementById("projectAdminCheckBox-" + this.projectMembers[i].getId())).checked; 
      if (adminBool) {
        this.adminMember[i] = adminBool;
      }
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
}
