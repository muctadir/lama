import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
    let p_id = this.rerouter.getProjectID(this.router.url);
    let result = await this.requestHandler.get('/change/changes', {'p_id': p_id, 'item_type': "Theme"}, true)


    console.log(result);
    return result
  }


}
