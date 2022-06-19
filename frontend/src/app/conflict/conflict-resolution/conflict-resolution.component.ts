// Veerle Furst
// Ana-Maria Olteniceanu
// Linh Nguyen

import { Component, OnInit } from '@angular/core';
import { StringArtifact } from 'app/classes/stringartifact';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { ConflictDataService } from 'app/services/conflict-data.service';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { ToastCommService } from 'app/services/toast-comm.service';
import { Label } from 'app/classes/label';

@Component({
  selector: 'app-conflict-resolution',
  templateUrl: './conflict-resolution.component.html',
  styleUrls: ['./conflict-resolution.component.scss']
})
export class ConflictResolutionComponent implements OnInit {
  // Initialize the artifact
  artifact: StringArtifact;
  // Initialize the ReroutingService
  routeService: ReroutingService;
  // Initialize the url
  url: string;
  // Initialize boolean value that represents whether the current user is admin
  admin: boolean;
  // Initialize the username of the current user
  username: string;
  // Initialize the project id
  p_id: number;
  // Initialize the label type id
  lt_id: number;
  // Initialize the artifact id
  a_id: number;
  // Label type of current conflict
  label_type: string;
  // Dictionary holding the users and the labels they gave 
  // for the conflict's label type along with their description
  label_per_user: Record<string, Record<string, any>>;
  // Array of usernames
  users: string[];
  // Array of labels in the label type
  labels: Label[];

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param conflictDataService instance of ConflictDataService
     * @param router instance of Router
     */
  constructor( private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private conflictDataService: ConflictDataService,
    private labellingDataService: LabellingDataService,
    private router: Router,
    private toastCommService: ToastCommService) {
    //Reinitializing the variables
    this.artifact = new StringArtifact(0, 'null', 'null');
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.admin = false;
    this.username = '';
    this.p_id = Number(this.routeService.getProjectID(this.url));
    this.lt_id = 0;
    this.a_id = 0;
    this.label_type = '';
    this.label_per_user = {};
    this.users = [];
    this.labels = [];
  }

  /**
   * Initializes artifact id, data and its label type 
   * Gets the artifact based on artifact id and project id
   *
   * @modifies label_type
   * @trigger on creation of component
   */
  async ngOnInit(): Promise<void> {
    // Get the ID of the artifact, label type and the project ID
    let ids = this.routeService.getArtifactConflict(this.url)
    this.a_id = Number(ids[0])
    this.lt_id = Number(ids[1])
    this.label_type = ids[2]
    // Get the artifact data from the backend
    await this.getArtifact(this.a_id, this.p_id)

    // Get the labels given by each user
    await this.getLabelPerUser(this.p_id, this.a_id, this.lt_id)

    // Get the labels in the label type
    await this.getLabelsByType(this.p_id, this.lt_id)
  }

  /**
   * Author: Ana-Maria Olteniceanu
   * Sets a specific artifacts and its necessary data from artifact-data.service
   * 
   * @param a_id the id of the artifact
   * @param p_id the id of the project
   */
  async getArtifact(a_id: number, p_id: number): Promise<void> {
    //Get an artifact based on given ID and project ID
    const result = await this.artifactDataService.getArtifact(p_id, a_id);
    //Assigning the response to the artifact, username (current user) and their admin status
    this.artifact = result["result"];
    this.username = result["username"];
    this.admin = result["admin"];
  }

  /**
   * Author: Ana-Maria Olteniceanu
   * Sets the dictionary holding the users and their labels and label
   * description from the label type of the current conflict
   * 
   * @param a_id the id of the artifact
   * @param p_id the id of the project
   * @param lt_id the id of the label type
   */
  async getLabelPerUser(p_id: number, a_id: number, lt_id: number): Promise<void> {
    // Get conflict information (users who labelled and ther labels) based on the project ID, artifact ID and label type ID
    const response = await this.conflictDataService.getLabelPerUser(p_id, a_id, lt_id);
    console.log(response)
    // Assigning the label given by a user to the entry with the key of their username in label_per_user
    this.label_per_user = response;
    // Getting the keys from users
    this.users = Object.keys(this.label_per_user);
  }


  /**
   * Author: Ana-Maria Olteniceanu
   * Gets the labels from a label type given by all users in a given project ID
   * 
   * @param p_id the id of the project
   * @param lt_id the id of the label type
   */
  async getLabelsByType(p_id: number, lt_id: number): Promise<void> {
    //Get labels from a certain label type
    const response = await this.conflictDataService.getLabelsByType(p_id, lt_id);
    // Add label names to the list of labels
    for (let label of response) {
      this.labels.push(new Label(label["id"], label["name"], label["description"], this.label_type));
    }
  }

  /**
   * Opens modal which contains the create LabelFormComponent.
   */
   openCreateForm(): void {
    let modal = this.modalService.open(LabelFormComponent, { size: 'xl' });
    modal.result.then((data) => {
      this.ngOnInit();
    });
  }

  updateLabelling(user: string, label: any): void {
    let selectedLabel: Label;
    try {
      selectedLabel = this.findLabel(this.labels, label);
      this.label_per_user[user] = {"description": selectedLabel.getDesc(), "name": selectedLabel.getName(), "id": selectedLabel.getId()};
    } catch (error) {
      this.toastCommService.emitChange([false, "Label doesn't exist"]);
    }   
    
  }

  findLabel(labels: Label[], label: string): Label {
    for (let eachLabel of labels) {
      if (eachLabel.getName() == label) {
        return eachLabel
      }
    }
    throw new Error("Label name invalid")
  }

  async updateLabellings(): Promise<void> {
    try {
      this.labellingDataService.editLabelling(this.p_id, this.lt_id, this.a_id, this.label_per_user)
    } catch (error) {
      this.toastCommService.emitChange([false, "Something went wrong! Please try again."]);
    }
    let labelCheck = new Set<string>();
    for (let labelling in this.label_per_user) {
      labelCheck.add(this.label_per_user[labelling]['name'])
    }
    if(labelCheck.size == 1) {
      console.log("Resolved");
      this.router.navigate(['/project', this.p_id, 'conflict'])
    }
    else {
      this.toastCommService.emitChange([false, "Conflict has not been resolved."]);
    }
  }
}
