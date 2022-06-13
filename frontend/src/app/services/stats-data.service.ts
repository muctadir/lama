import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';
import { Project } from 'app/classes/project';

@Injectable({
  providedIn: 'root'
})
export class StatsDataService {
  private requestHandler: RequestHandler;
  private sessionToken: string | null;

  constructor() {
    this.sessionToken = sessionStorage.getItem('ses_token');
    this.requestHandler = new RequestHandler(this.sessionToken);
  }

  /**
     * Function does call to backend to retrieve data from a single project
     * 
     * @params p_id: number
     * @pre p_id => 1
     * @throws Error if p_id < 1
     * @returns Promise<Array<StringArtifact>>
     */
  async getProject(p_id: number): Promise<Record<string, any>> {
    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1");

    // Make a request to the backend to get project data
    let response = await this.requestHandler.get('/project/singleProject', { 'p_id': p_id }, true)
    // Initialize a new project with all values
    let projectJson = response["project"];

    // Create the project with constructor
    let projectNew = new Project(
      projectJson["id"],
      projectJson["name"],
      projectJson["description"]
    )

    // Set other variables
    projectNew.setNumberOfArtifacts(response["projectNrArtifacts"]);
    projectNew.setNumberOfCLArtifacts(response["projectNrCLArtifacts"]);
    projectNew.setUsers(response["projectUsers"]);

    return { 'project_data': projectNew, 'conflicts': response["conflicts"] }
  }

  /**
     * Function does call to backend to retrieve 
     * 
     * @params p_id: number
     * @pre p_id => 1
     * @throws Error if p_id < 1
     * @returns Promise<Array<StringArtifact>>
     */
  async getUserStats(p_id: number) {
    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1");

    // Make a request to the backend to get user statistics
    let response = await this.requestHandler.get('/project/projectStats', { 'p_id': p_id }, true)

    return response
  }
}