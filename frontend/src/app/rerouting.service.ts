// Jarl Jansen
// Veerle Furst

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReroutingService {

  /**
   * Gets the project ID from a url string
   * @param url_path the url in string format
   * @returns project ID
   */
  getProjectID(url_path : string) : string {
    
    // Removes the first "/" from the string
    let p_id : string = url_path.substring(1); 

    // Removes everything before the first "/"
    p_id = p_id.substring(p_id.indexOf('/') + 1);

    // Removes everything after the project ID, (only project ID remains)
    p_id = p_id.substring(0, p_id.indexOf('/'));

    // Returns the project ID
    return p_id
  }

  /**
   * Gets the theme ID from a url string
   * @param url_path the url in string format
   * @returns theme ID
   */
   getThemeID(url_path : string) : string {

    // Makes a substring of text after the last /
    let t_id : string = url_path.substring(url_path.lastIndexOf("/"))
    // Removes the last /
    t_id = t_id.substring(1); 

    return t_id
  }
}
