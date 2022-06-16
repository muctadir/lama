// Victoria Bogachenkova
// Veerle Fürst
// Ana-Maria Olteniceanu
// Eduardo Costa Martins
// Jarl Jansen

import { Component, OnInit } from '@angular/core';
import { Project } from 'app/classes/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from 'app/modals/logout/logout.component';
import { ProjectDataService } from 'app/services/project-data.service';
import { AccountInfoService } from 'app/services/account-info.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  /* Array with the projects that the user can view */
  projects: Project[] = [];

  /* Error message that is displayed to the user */
  errorMsg: string = "";

  /* Saves the user data */
  user: any;

  /**
   * Initializes the modal service provided by bootstrap
   * 
   * @param modalService instance of modal
   * @trigger on loads
   */
  constructor(private modalService: NgbModal,
    private projectDataService: ProjectDataService,
    private accountService: AccountInfoService) {}

  /**
   * When the component gets created calls function to gather all the projects that the user is a member of
   * 
   * @trigger on component creation
   * @modifies projects
   */
  async ngOnInit(): Promise<void> {
    // Makes the request to the backend for the projects
    this.getProjects();
    // Makes the request to the backend to get the user data
    this.user = await this.accountService.userData();
  }

  /**
   * Sets the projects of a specific user from project-data.service
   * 
   * @Trigger the home page is loaded
  */
  async getProjects(): Promise<void> {
    const projects = await this.projectDataService.getProjects();
    this.projects = projects;
  }

  /**
   * Opens the logout modal asking confirmation for logging out
   * 
   * @trigger click on logout button
   */
  openLogout() : void {
    // opens logout modal
    this.modalService.open(LogoutComponent, {});
  }

}