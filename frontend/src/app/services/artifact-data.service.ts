import { Injectable } from '@angular/core';
import { StringArtifact } from 'app/classes/stringartifact';
import { RequestHandler } from 'app/classes/RequestHandler';

@Injectable({
  providedIn: 'root'
})
export class ArtifactDataService {
  private requestHandler: RequestHandler;
  private sessionToken: string | null;

  /**
   * Constructor instantiates requestHandler
   */
  constructor() {
    this.sessionToken = sessionStorage.getItem('ses_token');
    this.requestHandler = new RequestHandler(this.sessionToken);
  }

  /**
   * Function does call to backend to retrieve all artifacts of a given project
   * that can be viewed by the user
   * 
   * @params p_id: numberF
   * @pre p_id => 1
   * @throws Error if token == null
   * @throws Error if p_id < 1
   * @returns Promise<Array<StringArtifact>>
   */
  async getArtifacts(p_id: number): Promise<Array<StringArtifact>> {
    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1");

    // Array with results
    let result: Array<StringArtifact> = new Array<StringArtifact>();

    // Actual request
    let response = await this.requestHandler.get('/artifact/artifactmanagement', { 'p_id': p_id }, true);

    // For each artifact in the list
    response.forEach((artifact: any) => {
      // Initialize a new artifact with all values
      let artifactJson = artifact["artifact"];

      // Create an artifact object
      let artifactNew: StringArtifact = new StringArtifact(
        artifactJson["id"],
        artifactJson["identifier"],
        artifactJson["data"]
      );

      // Set the number of labellings on this artifact
      artifactNew.setLabellings(artifact["artifact_labellings"]);

      // Add the artifact to the result
      result.push(artifactNew);
    });

    // Return result
    return result;

  }

  /**
   * Function does call to backend to upload new artifacts
   * 
   * @params p_id: number
   * @pre p_id => 1
   * @pre artifacts.length > 0
   * @pre \forall i; 0 < i < artifacts.length; artifacts[i].length > 0
   * @throws Error if p_id < 1
   * @throws Error if artifacts.length <= 0
   * @throws Error if \exists i; 0 < i < artifacts.length; artifacts[i].length <= 0
   * @returns Promise<boolean>
   */
  async addArtifacts(p_id: number, artifacts: Record<string, any>[]): Promise<void> {
    // Check if the p_id is larger than 0
    if (p_id < 1) throw new Error("p_id cannot be less than 1")
    // Check if the list of artifacts is empty
    if (artifacts.length <= 0) throw new Error("No artifacts have been submitted")

    // Check if the artifact has any data
    for (const element of artifacts) {
      if (Object.keys(element).length <= 0) throw new Error("Artifacts cannot have empty fields")
    }

    let artifacts_rec = {
      'array': artifacts
    }

    // Send the data to the database
    await this.requestHandler.post('/artifact/creation', { 'p_id': p_id, 'artifacts': artifacts_rec }, true);
  }

  /**
     * Function does call to backend to retrieve a single artifact
     * 
     * @params p_id: number
     * @params a_id: number
     * @pre p_id => 1
     * @pre a_id => 1
     * @pre token != null
     * @throws Error if token == null
     * @throws Error if p_id < 1
     * @throws Error if a_id < 1
     * @returns Promise<StringArtifact>
     */
  async getArtifact(p_id: number, a_id: number): Promise<Record<string, any>> {
    
    // Session token
    let token: string | null = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");

    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1")

    // Check if the a_id is larger than 1
    if (a_id < 1) throw new Error("a_id cannot be less than 1")
    
    // Resulting artifact
    let result: StringArtifact = new StringArtifact(0, 'null', 'null');
    
    // Get the artifact information from the back end
    let response = await this.requestHandler.get('/artifact/singleArtifact', { 'p_id': p_id, 'a_id': a_id, 'extended': true }, true);

    // Get the artifact from the response
    let artifact = response['artifact'];

    // Get the artifact data
    result.setId(artifact["id"]);
    result.setIdentifier(artifact["identifier"]);
    result.setData(artifact["data"]);
    result.setParentId(artifact["parent_id"]);
    result.setChildIds(response["artifact_children"]);
    
    // Return the record
    return {
      "result": result,
      "labellings": response["artifact_labellings"],
      "username": response["username"],
      "admin": response["admin"]
    }
  }
}
