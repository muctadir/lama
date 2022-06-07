import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from 'app/classes/stringartifact';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class ArtifactDataService {

  /**
   * Function does call to backend to retrieve all artifacts of a given project
   * that can be viewed by the user
   * 
   * @params p_id: numberF
   * @pre p_id => 1
   * @pre token != null
   * @throws Error if token == null
   * @throws Error if p_id < 1
   * @returns Promise<Array<StringArtifact>>
   */
  getArtifacts(p_id: number): Promise<Array<StringArtifact>> {
    // Session token
    let token: string | null = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");

    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1")

    // Array with results
    let result: Array<StringArtifact> = new Array<StringArtifact>();

    // Actual request
    return axios.get('http://127.0.0.1:5000/artifact/artifactmanagement', {
      headers: {
        'u_id_token': token
      },
      params: {
        'p_id': p_id
      }
    }).then((response) => {
      // For each artifact in the list
      for (let artifact of response.data) {
        // Initialize a new artifact with all values
        let artifactJson = artifact["artifact"];
        artifactJson["id"] = artifact["artifact_id"];
        artifactJson["identifier"] = artifact["artifact_identifier"],
          artifactJson["data"] = artifact["artifact_text"];
        // TODO: Change
        artifactJson["labellings"] = artifact["artifact_labellings"];

        // Create an artifact object
        let artifactNew: StringArtifact = new StringArtifact(
          artifactJson["id"],
          artifactJson["identifier"],
          artifactJson["data"]
        )

        // Set the number of labellings on this artifact
        artifactNew.setLabellings(artifactJson["labellings"])

        // Add the artifact to the result
        result.push(artifactNew);
      }

      // Return result
      return result;
    }).catch((err) => {
      // If there is an error
      throw new Error(err);
    });

  }

  /**
   * Function does call to backend to upload new artifacts
   * 
   * @params p_id: numberF
   * @pre p_id => 1
   * @pre token != null
   * @pre artifacts.length > 0
   * @pre \forall i; 0 < i < artifacts.length; artifacts[i].length == 4
   * @throws Error if token == null
   * @throws Error if p_id < 1
   * @throws Error if artifacts.length <= 0
   * @throws Error if \exists i; 0 < i < artifacts.length; artifacts[i].length != 4
   * @returns Promise<boolean>
   */
  addArtifacts(p_id: number, artifacts: Record<string, any>[]): Promise<boolean> {
    let token: string | null = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    // Check if the list of artifacts is empty
    if (artifacts.length <= 0) throw new Error("No artifacts have been submitted")
    // Check if the artifacts are empty
    for (const element of artifacts) {
      if (Object.keys(element).length <= 0) throw new Error("Artifacts cannot have empty fields")
    }

    let result: boolean;
    console.log(artifacts)
    // Send the data to the database
    return axios.post('http://127.0.0.1:5000/artifact/creation', artifacts, {
      headers: {
        'u_id_token': token
      },
      params: {
        'p_id': p_id
      }
    }).then(response => {
      // p_response.innerHTML = "Artifacts added"
      return Math.floor(response.status / 100) == 2;
    })
      .catch(error => {
        result = false;
        return false;
      });
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
  getArtifact(p_id: number, a_id: number): Promise<Array<any>> {
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
    return axios.get('http://127.0.0.1:5000/artifact/singleArtifact', {
      headers: {
        'u_id_token': token
      },
      params: {
        'a_id': a_id,
        'extended': true
      }
    }).then(response => {
        // Get the artifact from the response
        let artifact = response.data['artifact'];

        // Get the artifact data
        result.setId(artifact["id"]);
        result.setIdentifier(artifact["identifier"]);
        result.setData(artifact["data"]);
        result.setParentId(artifact["parent_id"]);
        result.setChildIds(response.data["artifact_children"]);

        // Return the record
        return [result, response.data["artifact_labellings"], response.data["username"]]
        
      }).catch((err) => {
        // If there is an error
        throw new Error(err);
      });
  }
}
