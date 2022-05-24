import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-creation',
  styleUrls: ['./project-creation.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Choose the users to add to the project</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body row" *ngFor="let user of users" style="padding:2px 16px; max-height: 25px;">
        <div class="col" style="padding:1px; list-style: none; max-height: 25px;">
          <li> {{ user.userName }}</li>

        </div>
        <!-- Col for adding users button -->
        <div class="col-2">
            <!-- Button for adding new members -->
            <button class="btn" type="button" id="addMembersButton" (click)="addUser()">
                <svg class="bi bi-plus members" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
        </div>
        <br>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})

export class AddUsersModalContent {
  @Input() users: User[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  // Function for adding a new user input
  addUser(){
    this.users.push();
  }
}

// Project object
interface Project {
  projectName: string,
  projectDescription: string;
}
// User object
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
  Chinno6 = this.addValuesUser("Chinno6");
  Chinno7 = this.addValuesUser("Chinno7");

  // Array of memebers
  members: User[] = [this.Veerle, this.Vic, this.Bartjan, this.Jarl, this.Chinno, this.Chinno2, this.Chinno3, this.Chinno4, this.Chinno5, this.Chinno6, this.Chinno7];
  
  // Label types
  labelTypes: string[] = ["doing"];

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

  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService.open(AddUsersModalContent);
    modalRef.componentInstance.users = this.members;
  }

 }

