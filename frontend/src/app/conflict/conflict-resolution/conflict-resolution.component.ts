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
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { Label } from 'app/classes/label';
import { User } from 'app/classes/user';
import { ProjectDataService } from 'app/services/project-data.service'

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
  // Array of users
  users: User[];
  // Array of labels in the label type
  labels: Label[];
  //Frozen status of project
  frozen: boolean = true;

  /**
   * Information concerning the highlighting and cutting
   */
  hightlightedText: string = '';
  selectionStartChar?: number;
  selectionEndChar?: number;

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param conflictDataService instance of ConflictDataService
     * @param router instance of Router
     */
  constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private conflictDataService: ConflictDataService,
    private labellingDataService: LabellingDataService,
    private router: Router,
    private toastCommService: ToastCommService,
    private projectDataService: ProjectDataService) {
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
    // Clear the cache of labels
    this.labels = [];
    // Clear the cache of labellings
    this.label_per_user = {};
    // Clear the cache of users
    this.users = [];

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

    // Setting frozen status
    this.frozen = await this.projectDataService.getFrozen();
  }

  /**
   * Author: Ana-Maria Olteniceanu
   * Sets a specific artifacts and its necessary data from artifact-data.service
   * 
   * @param a_id the id of the artifact
   * @param p_id the id of the project
   */
  async getArtifact(a_id: number, p_id: number): Promise<void> {
    // Get an artifact based on given ID and project ID
    const result = await this.artifactDataService.getArtifact(p_id, a_id);
    // Assigning the response to the artifact, username (current user) and their admin status
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

    // Assigning the label given by a user to the entry with the key of their username in label_per_user
    this.label_per_user = response
    for (let labelling in this.label_per_user) {
      this.users.push(new User(this.label_per_user[labelling]["u_id"], labelling))
    }
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
   * @trigger user clicks create label button
   */
  openCreateForm(): void {
    let modal = this.modalService.open(LabelFormComponent, { size: 'xl' });
    modal.result.then((data) => {
      // Clear the cache of labels
      this.labels = [];
      // Reinitialize the page
      this.ngOnInit();
    });
  }

  /**
   * Updates the labelling when the dropdown selected value changes
   * 
   * @param user the username of the user who changed their labelling
   * @param label the name of the label to which the user is changing their labelling
   */
  async updateLabelling(user: User, label: string): Promise<void> {
    // Get the updated labelling
    let response = await this.labellingDataService.updateLabelling(
      user, label, this.labels, this.lt_id)

    // If the updated labelling was received
    if (response != null) {
      // Update the labelling
      this.label_per_user[user.getUsername()] = response;
    }
  }

  /**
   * Update the labellings in the backend
   */
  async updateLabellings(): Promise<void> {
    // Record that holds the labellings in the format required by the backend
    let labels_formatted: Record<string, any> = {}

    // Format each user's labellings
    for (let user in this.label_per_user) {
      labels_formatted[user] = {};
      labels_formatted[user][this.label_type] = this.label_per_user[user];
    }

    // Make call to the backend to store set of updated labellings
    try {
      await this.labellingDataService.updateLabellings(
        this.admin, this.p_id, this.a_id, this.username, labels_formatted)
    }
    // If there are errors during the call, the stop the function
    catch {
      return
    }

    // Checks if the set has only 1 value
    if (this.oneLabel()) {
      // This means that all labellings have the same label and therefore conflict is resolved
      // Display success toast
      this.toastCommService.emitChange([true, "Conflict resolved successfully"]);
      // Reinitialize user list
      this.users = [];
      // Reroute to the conflict page
      this.router.navigate(['/project', this.p_id, 'conflict'])
    }
    else {
      // If not, shows an error saying conflict is not solved
      this.toastCommService.emitChange([false, "Conflict has not been resolved."]);
    }
  }

  /**
   * Function that checks how many labels have been given for the current label type
   * @returns true if there is only one label given, false otherwise
   */
  oneLabel(): boolean {
    // Set to keep track of all current labellings
    let labelCheck = new Set<string>();
    // Adding each user's current labelling to the set
    for (let labelling in this.label_per_user) {
      labelCheck.add(this.label_per_user[labelling]['name'])
    }

    // Return true if there is only one label givem
    // False otherwise
    return labelCheck.size == 1
  }

  /**
   * Function to open the MergeLabelFormComponent modal
   * 
   * @trigger user clicks on the merge labels button
   */
  async openMerge() : Promise<void> {
    // Open the modal
    const modalRef = this.modalService.open(MergeLabelFormComponent, {
      size: 'xl',
    });
    modalRef.result.then(() => {
      // Reinitialize the page
      this.ngOnInit();
    });
  }

  /**
   * Splitting function, gets text without splitting words and gets start and end char
   */
  async split(): Promise<void> {
    // Get start/end positions of highlight
    let firstCharacter = this.selectionStartChar! - 1;
    let lastCharacter = this.selectionEndChar! - 1;
    // Fix positions to start/end of words that they clip
    firstCharacter = this.startPosFixer(firstCharacter);
    lastCharacter = this.endPosFixer(lastCharacter);
    // Get the text represented by the rounded start and end
    let splitText = this.artifact.data.substring(
      firstCharacter,
      lastCharacter
    );

    // Make request to split
    let splitId = await this.artifactDataService.postSplit(this.p_id, this.artifact.getId(), this.artifact.getIdentifier(), firstCharacter, lastCharacter, splitText);
    this.toastCommService.emitChange([true, "Artifact was successfully split into artifact #" + splitId]);
  }

  /**
 * Function is ran on mouseDown or mouseUp and updates the current selection
 * of the artifact. If the selection is null or empty, the selection is set
 * to ""
 */
  selectedText(): void {
    let hightlightedText: Selection | null = document.getSelection();
    //gets the start and end indices of the highlighted bit
    let startCharacter: number = hightlightedText?.anchorOffset!;
    let endCharacter: number = hightlightedText?.focusOffset!;
    //make sure they in the right order
    if (startCharacter > endCharacter) {
      startCharacter = hightlightedText?.focusOffset!;
      endCharacter = hightlightedText?.anchorOffset!;
    }
    //put into global variable
    this.selectionStartChar = startCharacter;
    this.selectionEndChar = endCharacter;
    //this is so the buttons still pop up, idk if we need it so ill ask bartgang
    if (hightlightedText == null || hightlightedText.toString().length <= 0) {
      this.hightlightedText = '';
    } else {
      this.hightlightedText = hightlightedText.toString();
    }
  }

  // Fixes the position of the start character of a word
  startPosFixer(startPos: number) : number {
    // Gets char at start of the word
    let chart = this.artifact.data.charAt(startPos);
    // Checks if it is at the correct position to begin with
    if (chart == ' ') {
      startPos = startPos + 1
      return startPos
    }
    // Start bound check
    if (startPos == 0) {
      return startPos
    }

    // Else, move until we find the start of a word
    while (chart != ' ' && startPos > 0) {
      chart = this.artifact.data.charAt(startPos);
      startPos--;
    }

    // Last adjustmensts for when the text goes too far
    if (startPos != 0) {
      startPos++;
    }
    return startPos

  }

  // Fixes the position of the start character of a word
  endPosFixer(endPos: number) : number {
    // Gets char at end of the word
    let chend = this.artifact.data.charAt(endPos);
    // See if the last char is correct to begin with
    if (chend == ' ' || endPos == this.artifact.data.length) {
      return endPos
    }
    // Fix such that the next word is not accidentally selected
    if (this.artifact.data.charAt(endPos - 1) == ' ') {
      endPos--
      return endPos
    }
    // Else, move until we find a space or hit the end of artifact
    while (chend != ' ' && endPos < this.artifact.data.length) {
      chend = this.artifact.data.charAt(endPos);
      endPos++;
    }

    return endPos
  }

  /**
   * Function for rerouting the user
   * 
   * @Trigger clicked on the back button
   */
  reRouter() : void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'conflict']);
  }
}