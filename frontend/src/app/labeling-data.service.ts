import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from './stringartifact';
import { LabelType } from './label-type';
import { Label } from './label';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class LabelingDataService {

  /**
   * Function does call to backend to retrieve all labels of a given project.
   * @params p_id: number
   * @pre p_id => 0
   * @pre token == null
   * @throws Error if token == null
   * @throws Error if p_id < 0
   * @returns Promise<Array<Label>>
   */
  getLabels(p_id: number): Promise<Array<Label>> {
    // Session token
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    // Array with results
    let result: Array<Label> = new Array<Label>();
    // Actual request 
    return axios.get('http://127.0.0.1:5000/label/getAll', {
      headers: {
        'u_id_token': token
      }, 
      params: {
        'p_id': 2
      }
    }).then((response) => {
      // Put response in object
      response.data.forEach((d: any) => {
        console.log(d.label.id)
        result.push(new Label(d.label.id, d.label.name, 
        d.label.description, d.label_type));
      });
      // return result
      return result;
    }).catch((err) => {
      // If there is an error
      throw new Error(err);
    });
  }

  pushLabels(newLabels: Array<LabelType>): void{
    console.log("Pushing to backend...")
    console.log(newLabels)
    throw new Error("Not implemented")
  }
}