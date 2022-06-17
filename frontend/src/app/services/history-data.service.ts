import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Changelog } from 'app/classes/changelog';
import { RequestHandler } from 'app/classes/RequestHandler';
import { ReroutingService } from './rerouting.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryDataService {
  private requestHandler: RequestHandler;

  constructor(private rerouter: ReroutingService, private router: Router) {
    // Gets the token from the storage
    let token = sessionStorage.getItem('ses_token');
    // Creates an instance of the requestHandler 
    this.requestHandler = new RequestHandler(token);
  }

  async getHistory(type: string): Promise<Array<Changelog>> {
    // Gets the project id from the url
    let p_id = this.rerouter.getProjectID(this.router.url);

    let i_id: string;

    if(type == "Theme") {
      i_id = this.rerouter.getThemeID(this.router.url);
    } else if (type == "Label") {
      i_id = this.rerouter.getLabelID(this.router.url);
    } else {
      i_id = this.rerouter.getArtifactID(this.router.url);
    }

    // Makes the request to the backend for the changelogs
    let result = await this.requestHandler.get('/change/changes', {'p_id': p_id, 'item_type': type, 'i_id': i_id}, true);

    // Makes the list of Changelogs
    let changelogArray: Changelog[] = [];

    // Gets the different changelogs out of the request response
    result.forEach((changelog: any) => {
      // Creates the changelog object
      let change = new Changelog(changelog["username"], changelog["timestamp"], changelog["description"]);
      // Pushes the changelog object onto the changelog array
      changelogArray.push(change);
    });

    // Returns the array with changelogs
    return changelogArray;
  }


}
