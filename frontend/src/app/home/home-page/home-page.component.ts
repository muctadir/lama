// Victoria Bogachenkova
// Veerle Fürst
// Ana-Maria Olteniceanu
// Eduardo Costa Martins
// Jarl Jansen

import { Component, OnInit } from '@angular/core';
import { Project } from 'app/classes/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDataService } from 'app/services/project-data.service';
import { AccountInfoService } from 'app/services/account-info.service';
import { ToastCommService } from 'app/services/toast-comm.service';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  /* Array with the projects that the user can view */
  projects: Project[] = [];

  /* Saves the user data */
  user: any;

  /**
   * Initializes the modal service, projectDataService, AccountInfoService, ToastCommService, Router
   * 
   * @param modalService instance of modal
   * @param projectDataService instance of ProjectDataService
   * @param accountService instance of AccountInfoService
   * @param toastCommService instance of ToastCommService
   * @param route instance of Router
   * 
   * @trigger on component load
   */
  constructor(private modalService: NgbModal,
    private projectDataService: ProjectDataService,
    private accountService: AccountInfoService,
    private toastCommService: ToastCommService,
    private route: Router) { }

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
  openLogout(): void {
    // Opens logout modal
    let modalRef = this.modalService.open(ConfirmModalComponent, {});

    // Listens for an event emitted by the modal
    modalRef.componentInstance.confirmEvent.subscribe(async ($e: boolean) => {
      // If a confirmEvent = true is emitted we delete the user
      if ($e) {
        // Drops the session token
        sessionStorage.removeItem('ses_token');

        // Navigates to the login page
        this.route.navigate(['/login']);

        // Logged out popup
        this.toastCommService.emitChange([true, "Logged out successfully"]);
      }
    })
  }

}