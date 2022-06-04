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

  // Gets all labels from the backend
  getLabels(): Promise<Label[]> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    let result: Array<Label> = new Array<Label>();
    if (typeof token !== "string") throw new Error();

    return axios.get('http://127.0.0.1:5000/label/getAll', {
      headers: {
        'u_id_token': token
      }, 
      params: {
        'p_id': 2
      }
    }).then((response) => {
      console.log(response)
      response.data.forEach((d: any) => {
        console.log(d.label.id)
        result.push(new Label(d.label.id, d.label.name, 
        d.label.description, d.label_type));
      })
      return result;
    }).catch((err) => {
      throw new Error(err);
    })
    }

  getLabelTypes(): Promise<LabelType[]> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    let result: Array<LabelType>  = new Array<LabelType>();


    if (typeof token !== "string") throw new Error();
    return axios.get('http://127.0.0.1:5000/labeltype/getAll', {
      headers: {
        'u_id_token': token
      }, 
      params: {
        'p_id': 1,
      }
    }) 
    .then(response => {
      response.data.forEach((u: any) => {
        result.push(new LabelType(u['id'], u['name'], new Array<Label>()))
      });
      return result;
    })
    .catch(err => {
      throw new Error(err);
    });
  }

  pushLabels(newLabels: Array<LabelType>): void{
    console.log("Pushing to backend...")
    console.log(newLabels)
    throw new Error("Not implemented")
  }
}