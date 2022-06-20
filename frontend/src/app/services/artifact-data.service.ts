import { Injectable } from '@angular/core';
import { StringArtifact } from 'app/classes/stringartifact';
import { RequestHandler } from 'app/classes/RequestHandler';

@Injectable({
  providedIn: 'root',
})
export class ArtifactDataService {
  // Initialise the Request handler
  requestHandler: RequestHandler;

  // Constructors for the request handler
  constructor() {
    this.requestHandler = new RequestHandler(
      sessionStorage.getItem('ses_token')
    );
  }

  /**
   * Function does call to backend to retrieve all artifacts of a given project
   * that can be viewed by the user
   *
   * @params p_id: numberF
   * @pre p_id => 1
   * @throws Error if p_id < 1
   * @returns Promise<Array<StringArtifact>>
   */
  async getArtifacts(p_id: number, page: number, pageSize: number, seekIndex: number, seekPage: number): Promise<[number, number, Array<StringArtifact>]> {
    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1");

    // Array with results
    let artifacts: Array<StringArtifact> = new Array<StringArtifact>();

    // Actual request
    let response = await this.requestHandler.get('/artifact/artifactmanagement', {
      'p_id': p_id,
      'page': page,
      'page_size': pageSize,
      'seek_index': seekIndex,
      'seek_page': seekPage }, true);

    // For each artifact in the list
    response['info'].forEach((artifact: any) => {
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
      artifacts.push(artifactNew);
    });

    // Return result
    return [response['nArtifacts'], response['nLabelTypes'], artifacts];

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
  async addArtifacts(p_id: number, artifacts: Record<string, any>[]): Promise<any> {
    // Check if the p_id is larger than 0
    if (p_id < 1) throw new Error("p_id cannot be less than 1")
    // Check if the list of artifacts is empty
    if (artifacts.length <= 0) throw new Error("No artifacts have been submitted")

      // Check if the artifact has any data
      for (const element of artifacts) {
        if (Object.keys(element).length <= 0) throw new Error("Artifacts cannot have empty fields")
      }
      // Record containting the artifacts
      let artifacts_rec = {
        'array': artifacts
      }
      // Send the data to the database
      return this.requestHandler.post('/artifact/creation', { 'p_id': p_id, 'artifacts': artifacts_rec }, true);
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
      "u_id": response["u_id"],
      "admin": response["admin"],
      "users": response["users"]
    }
  }

  /**
   * Function gets a single random artifact
   *
   * @params p_id: number
   * @pre p_id => 1
   * @pre token != null
   * @throws Error if token == null
   * @throws Error if p_id < 1
   * @returns Promise<StringArtifact>
   */
  async getRandomArtifact(p_id: number): Promise<StringArtifact> {
    // Response from the request handler
    const response = await this.requestHandler.get(
      '/artifact/randomArtifact',
      { p_id: p_id },
      true
    );

    // Get a new artifact
    const result = new StringArtifact(
      response.artifact.id,
      response.artifact.identifier,
      response.artifact.data
    );

    // Set the child IDs and the parent ID
    result.setChildIds(response.childIds);
    result.setParentId(response.parentId);

    return result;
  }

  /**
   * Function gets all the labellers of a specific artifact
   *
   * @param p_id: number - project id
   * @param a_id: number - artifact id
   * @returns Promise<any>
   */
  async getLabellers(p_id: number, a_id: number): Promise<any> {
    return this.requestHandler.get(
      '/artifact/getLabellers',
      { p_id: p_id, a_id: a_id },
      true
    );
  }

  // Function for searching in backend
  async search(
    searchWords: string,
    p_id: number
  ): Promise<Array<StringArtifact>> {
    // Get the artifact information from the back end
    let response = await this.requestHandler.get(
      '/artifact/search',
      { p_id: p_id, search_words: searchWords },
      true
    );

    // Get the artifact from the response
    let artifacts = response;

    // Return the record
    return artifacts;
  }

  /**
   * Function posts all the highlights of a specific artifact from a specific user
   *
   * @param p_id: number - project id
   * @param a_id: number - artifact id
   * @param u_id: number - user id
   * @returns Promise<any>
   */
  async postHighlights(p_id: number, a_id: number, u_id: number): Promise<any> {
    await this.requestHandler.post(
      '/artifact/newHighlights',
      {
        p_id: p_id,
        a_id: a_id,
        u_id: u_id,
      },
      true
    );
  }
  /**
   * Post the split to the database 
   * 
   * @param p_id 
   * @param parent_id 
   * @param identifier 
   * @param start 
   * @param end 
   * @param data 
   */
  async postSplit(p_id: number, 
    parent_id: number, 
    identifier: string, 
    start: number, 
    end: number, 
    data: string): Promise<any> {
    return this.requestHandler.post('/artifact/split', {
      p_id: p_id,
      parent_id: parent_id,
      identifier: identifier,
      start: start,
      end: end,
      data: data
    },
    true
    )
  }
}
