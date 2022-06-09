import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
import axios from 'axios';
import { Theme } from 'app/classes/theme';
import { RequestHandler } from 'app/classes/RequestHandler';
@Injectable({
  providedIn: 'root'
})
export class LabelingDataService {
  requestHandler: RequestHandler;

  constructor() {
    this.requestHandler = new RequestHandler(sessionStorage.getItem('ses_token'));
  }

  async getLabels(p_id: number): Promise<Array<Label>> {
    const response = await this.requestHandler.get('/label/allLabels', { 'p_id': p_id }, true);

    const result = new Array<Label>();

    response.forEach((r: any) => {
      result.push(new Label(r.label.id, r.label.name, r.label.desc, r.label_type));
    });

    return result;
  }


  async getLabel(p_id: number, label_id: number): Promise<Label> {
    const response = await this.requestHandler.get('/label/singleLabel', { 'p_id': p_id, 'label_id': label_id }, true);

    const result = new Label(response.label.id, response.label.name, response.label.desc, response.label_type);

    let ThemeArray = new Array<Theme>();

    response.themes.forEach((r: any) => {
      ThemeArray.push(new Theme(r.id, r.name, r.description));
    });

    result.setThemes(ThemeArray);

    return result;
  }

  async getLabelling(p_id: number, label_id: number): Promise<any> {
    return this.requestHandler.get('/labelling/by_label', { 'p_id': p_id, 'label_id': label_id }, true);
  }

  /**
   *
   */
  async getLabelTypes(p_id: number): Promise<Array<LabelType>> {
    let result = new Array<LabelType>();
    let response = await this.requestHandler.get('/labeltype/all', { 'p_id': p_id }, true)
    response.forEach((d: any) => {
      result.push(new LabelType(d.id, d.name, new Array<Label>()))
    });
    return result;
  }

  async submitLabel(p_id: number, label: Label,
    labelTypeId: number): Promise<void> {

    let content: Object = {
      'labelTypeId': labelTypeId,
      'labelName': label.getName(),
      'labelDescription': label.getDesc(),
      'p_id': p_id
    }

    await this.requestHandler.post('/labeltype/all', content, true)
  }

  editLabel(p_id: number, label: Label,
    labelTypeId: number): Promise<boolean> {



    let token: string | null = sessionStorage.getItem('ses_token');
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
        return Math.floor(response.status / 100) == 2;
      }).catch(err => {
        return false;
      });
  }

  async getLabelTypesWithLabels(p_id: number): Promise<Array<LabelType>> {
    let labelTypes: Array<LabelType> = new Array<LabelType>();
    const response = await this.requestHandler.get('/labeltype/allLabelTypesWL', { 'p_id': p_id }, true);
    response.forEach((r: any) => {
      let labelArray: Array<Label> = new Array<Label>();
      r.labels.forEach((l: any) => {
        labelArray.push(new Label(l.id, l.name, l.description, r.label_type.name))
      })
      labelTypes.push(new LabelType(r.label_type.id, r.label_type.name, labelArray))
    })
    return labelTypes;
  }
}
