import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
import axios from 'axios';
import { Theme } from './classes/theme';
import { Labelling } from './classes/labelling';
@Injectable({
  providedIn: 'root'
})
export class LabelingDataService {

  /**
   * Function does call to backend to retrieve all labels of a given project.
   * @params p_id: number
   * @pre p_id > 0
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
        'p_id': p_id
      }
    }).then((response) => {
      // Put response in object
      response.data.forEach((d: any) => {
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

  /**
   *
   * @param p_id
   * @param label_id
   * @returns
   */
  getLabel(p_id: number, label_id: number): Promise<Label> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    // Check if label_id larger than 0
    if (label_id < 0) throw new Error("label_id cannot be less than 0")
    let result: Label;
    return axios.get('http://127.0.0.1:5000/label/get', {
      headers: {
        'u_id_token': token
      },
      params: {
        'p_id': p_id,
        'label_id': label_id
      }
    }).then((response) => {
      // Make Label object
      let label = new Label(response.data.label.id, response.data.label.name,
      response.data.label.description, response.data.label_type);
      // Get themes information from response
      let Themes: Array<any> = response.data.themes;
      // Prepare empty array for themes
      let ThemeArray: Array<Theme> = new Array<Theme>();
      // Process the Themes
      Themes.forEach((d:any) => {
        ThemeArray.push(new Theme(d.id, d.name, d.desc))
      });
      // Set the themes
      label.setThemes(ThemeArray);
      // Return
      return label;
    });
  }

  getLabelling(p_id: number, label_id: number): Promise<any> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    // Check if label_id larger than 0
    if (label_id < 0) throw new Error("label_id cannot be less than 0")
    let result: Label;
    return axios.get('http://127.0.0.1:5000/labelling/by_label', {
      headers: {
        'u_id_token': token
      },
      params: {
        'p_id': p_id,
        'label_id': label_id
      }
    }).then((response) => {
      return response.data;
    }).catch(e => {throw e;});
  }

  /**
   *
   */
  getLabelTypes(p_id: number): Promise<Array<LabelType>> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    let result: Array<LabelType> = new Array<LabelType>();
    return axios.get('http://127.0.0.1:5000/labeltype/getAll', {
      headers: {
        'u_id_token': token
      },
      params: {
        'p_id': p_id,
      }
    }).then((response) => {
      response.data.forEach((d: any) => {
        result.push(new LabelType(d.a_id, d.remark, new Array<Label>()))
      });
      console.log(result);
      return result;
    }).catch(err => {
      throw err;
    });

  }

  submitLabel(p_id: number, label: Label,
    labelTypeId: number): Promise<boolean> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    return axios.post('http://127.0.0.1:5000/label/create',
     {
       'labelTypeId': labelTypeId,
       'labelName': label.getName(),
       'labelDescription': label.getDesc(),
       'p_id': p_id
      },
      {
        headers: {
        'u_id_token': token
        }
      })
      .then((response) => {
      return Math.floor(response.status/100) == 2;
    }).catch(err => {
      return false;
    });
  }

  editLabel(p_id: number, label: Label,
    labelTypeId: number): Promise<boolean> {
    let token: string | null  = sessionStorage.getItem('ses_token');
    // Check if the session token exists
    if (typeof token !== "string") throw new Error("User is not logged in");
    // Check if the p_id is larger than 0
    if (p_id < 0) throw new Error("p_id cannot be less than 0")
    return axios.patch('http://127.0.0.1:5000/label/edit',
     {
       'labelId': label.getId(),
       'labelName': label.getName(),
       'labelDescription': label.getDesc(),
       'p_id': p_id
      },
      {
        headers: {
        'u_id_token': token
        }
      })
      .then((response) => {
      return Math.floor(response.status/100) == 2;
    }).catch(err => {
      return false;
    });
  }
}
