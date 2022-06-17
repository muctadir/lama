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
    let token = sessionStorage.getItem('ses_token');
    this.requestHandler = new RequestHandler(token);
  }

  async getThemeHistory(): Promise<any> {
    // Gets the project id from the url
    let p_id = this.rerouter.getProjectID(this.router.url);
    // Makes the request to the backend for the changelogs
    let result = await this.requestHandler.get('/change/changes', {'p_id': p_id, 'item_type': "Theme"}, true)

    // Makes the list of Changelogs
    let changelogArray: Changelog[] = [];

    // Gets the different changelogs out of the request response
    result.forEach((changelog: any) => {
      // Creates the changelog object
      let change = new Changelog(changelog["i_id"], changelog["username"], changelog["timestamp"], changelog["description"]);
      // Pushes the changelog object onto the changelog array
      changelogArray.push(change);
    });

    // TODO: remove this console log
    console.log(changelogArray);
    // Returns the array with changelogs
    return changelogArray;
  }


}
