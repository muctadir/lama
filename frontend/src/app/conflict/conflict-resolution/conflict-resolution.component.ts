// Veerle Furst
// Ana-Maria Olteniceanu
// Linh Nguyen

import { Component, OnInit } from '@angular/core';
import { StringArtifact } from 'app/classes/stringartifact';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { ConflictDataService } from 'app/services/conflict-data.service';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';

// Labelled object 
interface Labeller {
  labellerName: string,
  labellerRemark: string,
  current: boolean;
}

// Functions for adding values
function addValuesLabeller(labeller: string, remark: string, cur: boolean): Labeller {
  var labellerName = labeller;
  var labellerRemark = remark;
  var current = cur;
  // Return the given values
  return { labellerName, labellerRemark, current };
}

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
  // Label type of current conflict
  label_type: string;
  // Dictionary holding the users and the labels they gave for the conflict's label type
  label_per_user: Record<string, Record<string, any>>
  // Array of usernames
  users: string[];
  // Array of labels in the label type
  labels: Array<string> = [];

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param artifactDataService instance of ArtifactDataService
     * @param router instance of Router
     */
  constructor(private artifactDataService: ArtifactDataService,
    private conflictDataService: ConflictDataService,
    private router: Router) {
    this.artifact = new StringArtifact(0, 'null', 'null');
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.admin = false;
    this.username = '';
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
    // Get the ID of the artifact and the project
    let ids = this.routeService.getArtifactConflict(this.url)
    let a_id = Number(ids[0])
    let lt_id = Number(ids[1])
    this.label_type = ids[2]
    let p_id = Number(this.routeService.getProjectID(this.url));

    // Get the artifact data from the backend
    await this.getArtifact(a_id, p_id)

    // Get the labels given by each user
    await this.getLabelPerUser(p_id, a_id, lt_id)

    // Get the labels in the label type
    await this.getLabelsByType(p_id, lt_id)

    console.log(this.label_per_user)
  }

  /**
   * Author: Ana-Maria Olteniceanu
   * Sets a specific artifacts and its necessary data from artifact-data.service
   * 
   * @param a_id the id of the artifact
   * @param p_id the id of the project
   */
  async getArtifact(a_id: number, p_id: number): Promise<void> {
    const result = await this.artifactDataService.getArtifact(p_id, a_id);
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
    const response = await this.conflictDataService.getLabelPerUser(p_id, a_id, lt_id);
    this.label_per_user = response;
    this.users = Object.keys(this.label_per_user);

  }

  async getLabelsByType(p_id: number, lt_id: number): Promise<void> {
    const response = await this.conflictDataService.getLabelsByType(p_id, lt_id);
    // Add label names to the list of labels
    let labels = []
    for(let label of response) {
      labels.push(label["name"]); 
    }
    this.labels = labels
    console.log(this.label_per_user['ana2001']['name']);
    
  }
}
