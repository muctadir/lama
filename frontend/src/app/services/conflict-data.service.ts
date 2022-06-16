import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';

@Injectable({
  providedIn: 'root'
})
export class ConflictDataService {
  private requestHandler: RequestHandler;
  private sessionToken: string | null;

  constructor() { 
    this.sessionToken = sessionStorage.getItem('ses_token');
    this.requestHandler = new RequestHandler(this.sessionToken);
  }

  /**
   * Function does call to backend to retrieve all conflicts of a given project
   * that can be viewed by the user
   * 
   * @params p_id: numberF
   * @pre p_id => 1
   * @throws Error if token == null
   * @throws Error if p_id < 1
   * @returns Promise<Array<StringArtifact>>
   */
  async getConflicts(p_id: number): Promise<Array<any>> {
    // Check if the p_id is larger than 1
    if (p_id < 1) throw new Error("p_id cannot be less than 1");

    // Array with results
    let result: Array<any> = new Array<any>();

      // Makes the request to the backend for all users in the application
      let response: any = await this.requestHandler.get(
        "/conflict/conflictmanagement", {'p_id': p_id}, true);

      // Add the information form each conflict to result
      response.forEach((conflict: any) => {
        result.push({
          'conflictName': conflict.a_id,
          'conflictData': conflict.a_data,
          'conflictLTid': conflict.lt_id,
          'conflictLT': conflict.lt_name,
          'conflictUsers': conflict.users
        })
      });

      // Return the result
      return result;
  }

  async getLabelPerUser(p_id: number, a_id: number, lt_id: number): Promise<Record<string, any>> {
    // Make call to the backend and return the response
    let response = await this.requestHandler.get('/conflict/LabelPerUser', 
    {'p_id': p_id, 'a_id': a_id, 'lt_id': lt_id}, true);
    return response
  }
}
