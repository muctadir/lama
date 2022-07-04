// Author: Jarl Jansen
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Changelog } from 'app/classes/changelog';
import { RequestHandler } from 'app/classes/RequestHandler';
import { ReroutingService } from './rerouting.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryDataService {
  /* Stores an instance of the requestHandler */
  private requestHandler: RequestHandler;

  /**
   * Initializes the ReroutingService and the Router
   * 
   * @param rerouter instance of ReroutingService
   * @param router instance of Router
   */
  constructor(private rerouter: ReroutingService, private router: Router) {
    // Gets the token from the storage
    let token = sessionStorage.getItem('ses_token');
    // Creates an instance of the requestHandler 
    this.requestHandler = new RequestHandler(token);
  }

  /**
   * Gets the chnagelogs for an item with type @type (Theme, Label, Artifact). 
   * Returns the array with the changelogs
   * 
   * @param type type of item for which the changelog should be found
   * @returns array with changelogs
   */
  async getHistory(type: string): Promise<Array<Changelog>> {
    // Gets the project id from the url
    let p_id = this.rerouter.getProjectID(this.router.url);

    // item id of the theme, label or artifact
    let i_id: string;

    if (type == "Theme") {
      // Gets theme id from url
      i_id = this.rerouter.getThemeID(this.router.url);
    } else if (type == "Label") {
      // Gets label id from url
      i_id = this.rerouter.getLabelID(this.router.url);
    } else if (type == "Artifact") {
      // Gets artifact id from url
      i_id = this.rerouter.getArtifactID(this.router.url);
    } else {
      // If the parameter is none of the above throw an error
      throw new Error("invalid input given");
    }

    // Makes the request to the backend for the changelogs
    let result = await this.requestHandler.get('/change/changes', { 'p_id': p_id, 'item_type': type, 'i_id': i_id }, true);

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