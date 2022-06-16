import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';

@Injectable({
  providedIn: 'root'
})
export class HistoryDataService {
  private requestHandler: RequestHandler;

  constructor() {
    let token = sessionStorage.getItem('ses_token');
    this.requestHandler = new RequestHandler(token);
  }

  getThemeHistory() {
    console.log("get theme history")
  }


}
