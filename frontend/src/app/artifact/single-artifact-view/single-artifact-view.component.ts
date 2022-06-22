import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { ToastCommService } from 'app/services/toast-comm.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { StringArtifact } from 'app/classes/stringartifact';
import { HistoryComponent } from 'app/modals/history/history.component';
import { LabelType } from 'app/classes/label-type';
import { User } from 'app/classes/user';
import { Label } from 'app/classes/label';

@Component({
  selector: 'app-single-artifact-view',
  templateUrl: './single-artifact-view.component.html',
  styleUrls: ['./single-artifact-view.component.scss']
})
export class SingleArtifactViewComponent implements OnInit {

  // Initialize the ReroutingService
  routeService: ReroutingService;
  // Initialize the artifact
  artifact: StringArtifact;
  // Initialize list of users
  users: Array<User>;
  // Initialize array of label types in the project
  labelTypes: Array<LabelType>;
  // Initialize the url
  url: string;
  // Initialize record of labels given per label type + remarks
  userLabels: Record<string, Record<string, any>>;

  // Initialize boolean value that represents whether the current user is admin
  admin: boolean;
  // Initialize the username of the current user
  username: string;
  // Initialize the project id
  p_id: number;
  // Initialize the artifact id
  a_id: number;
  // Initialize boolean value that represent whether the labels in this page have been changed
  changed: boolean;

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param router instance of Router
     */
  constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private labellingDataService: LabellingDataService,
    private toastCommService: ToastCommService,
    private router: Router) {
    //Initializing variables
    this.routeService = new ReroutingService();
    this.artifact = new StringArtifact(0, 'null', 'null');
    this.users = [];
    this.labelTypes = new Array<LabelType>();
    this.url = this.router.url;
    this.userLabels = {};
    this.admin = false;
    this.username = '';
    this.p_id = Number(this.routeService.getProjectID(this.url));
    this.a_id = Number(this.routeService.getArtifactID(this.url));
    this.changed = false;
  }

  /**
   * Gets the artifact id, project ID and the artifact from the backend
   * Stores the users in the allMembers array
   * Gets project information from the backend
   * Store the project in currentProject
   *
   * @modifies allMembers, currentProject
   * @trigger on creation of component
   */
  async ngOnInit(): Promise<void> {
    // Reset the changed variable
    this.changed = false;
    // Reset the list of users
    this.users = [];
    // Get the artifact data from the backend
    this.getArtifact(this.a_id, this.p_id);
    // Get the label types with their labels
    await this.getLabelTypesWithLabels(this.p_id);
  }

  /**
  * Sets a specific artifacts and its necessary data from artifact-data.service
  * 
  * @param a_id the id of the artifact
  * @param p_id the id of the project
  */
  async getArtifact(a_id: number, p_id: number): Promise<void> {
    // Get all the artifact data from the backend
    const result = await this.artifactDataService.getArtifact(p_id, a_id);

    // Set the artifact
    this.artifact = result["result"];
    // Set the labels by user
    this.userLabels = result["labellings"];
    // Set the username of the current user
    this.username = result["username"];
    // Set the admin status of the current user
    this.admin = result["admin"];

    // Set the list of users
    for (let user of result["users"]) {
      this.users.push(new User(user["id"], user["username"]))
    }
  }

  /**
   * Opens the modal displaying the artifact history
   * 
   * @trigger on click of history icon
   */
  openArtifactHistory(): void {
    // Opens artifact history modal
    let modalRef = this.modalService.open(HistoryComponent, { size: 'xl' });

    // Passes the type of history we want to view
    modalRef.componentInstance.history_type = "Artifact";
  }
  /** 
   * Function for getting the label and labeltypes
   * @param p_id
   */
  async getLabelTypesWithLabels(p_id: number): Promise<void> {
    // Try to get the label type and labels
    try {
      // Make call to the backend
      const labelTypes =
        await this.labellingDataService.getLabelTypesWithLabels(p_id);
      // Set the list of label types
      this.labelTypes = labelTypes;
      // If an error is caught, redirect user to the project's homepage
    } catch {
      this.router.navigate(['/project', p_id]);
    }
  }

  /**
   * Updates the labelling when the dropdown selected value changes
   * 
   * @param user the username of the user who changed their labelling
   * @param label the name of the label to which the user is changing their labelling
   * @param lt_id the label type id
   * @param labels list of all labels from the label type
   */
  updateLabelling(user: User, label: string, lt_id: number, labels: Array<Label>): void {
    // Get the updated labelling
    let result = this.labellingDataService.updateLabelling(user, label, labels, lt_id)
    // If the updated labelling was received
    if(result != null) {
      // Store the labelling remark
      let remark = this.userLabels[user.getUsername()][result["lt_name"]]["labelRemark"]
      // Update the labelling in userLabels
      this.userLabels[user.getUsername()][result["lt_name"]] = result
      // Place the remark back into the labelling
      this.userLabels[user.getUsername()][result["lt_name"]]["labelRemark"] = remark
    }
    this.changed = true;
  }

  /**
   * Function that sends a request to the backend to store 
   * the labellings in this page into the database
   */
  async updateLabellings() {
    try {
      // Make the request to the backend
      await this.labellingDataService.updateLabellings(
        this.admin, this.p_id, this.a_id, this.username, this.userLabels)
      // If the request was met successfully, display a success toast
      this.toastCommService.emitChange([true, "New labels saved successfully!"])
    // If there was an error while saving the labellings, display an error toast
    } catch (error) {
      this.toastCommService.emitChange([false, "Something went wrong while saving."])
    }
    this.ngOnInit()
  }
}