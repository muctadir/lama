// Jarl Jansen
// Ana-Maria Olteniceanu
// Veerle Furst

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReroutingService {

  /**
   * Gets the position of an char in string
   * @param string the input string
   * @param subString the sub-string we want to find
   * @param index which occurence we are looking for
   * @returns the index of the start of substring
   */
  getPosition(string: string, subString: string, index: number) {
    return string.split(subString, index).join(subString).length;
  }

  /**
   * Gets the project ID from a url string
   * @param url_path the url in string format
   * @returns project ID
   */
  getProjectID(url_path: string): string {

    // Removes the first "/" from the string
    let p_id: string = url_path.substring(1);

    // Removes everything before the first "/"
    p_id = p_id.substring(p_id.indexOf('/') + 1);

    // Removes everything after the project ID, (only project ID remains)
    p_id = p_id.substring(0, p_id.indexOf('/'));

    // Returns the project ID
    return p_id
  }

  /**
   * Gets the label ID from a url string
   * @param url_path the url in string format
   * @returns label ID
   */
  getLabelID(url_path: string): string {
    // Get position of third slash
    let third_slash = this.getPosition(url_path, '/', 4);

    // Removes everything before the third "/"
    let label_id: string = url_path.substring(third_slash + 1);

    // Removes everything after the label ID, (only label ID remains)
    label_id = label_id.substring(0, third_slash);

    return label_id
  }

  /** Gets the artifact ID from a url string
   * @param url_path the url in string format
   * @returns artifact ID
   */
  getArtifactID(url_path: string): string {
    // Removes the first "/" from the string
    let a_id: string = url_path.substring(url_path.lastIndexOf("/"))
    // Removes the last /
    a_id = a_id.substring(1);
    return a_id
  }

  /** Gets the artifact ID and label ID from a url string
   * @param url_path the url in string format
   * @returns artifact ID
   * @returns label type ID
   * @returns label type name
   */
  getArtifactConflict(url_path: string): Array<string> {
    // Get the artifact id and the label type id in form
    // artifact_id/label_type_id/label_type_name
    let ids = this.getLabelID(url_path)
    // Get the position of the first /
    let pos = ids.indexOf('/')
    // Get the artifact id from ids
    let a_id = ids.substring(0, pos);

    // Get the substring of form label_type_id/label_type_name
    let lt = ids.substring(pos + 1)
    // Get the position of the /
    pos = lt.indexOf('/')
    // Get the label type id from lt
    let lt_id = lt.substring(0, pos)
    // Get the labe type name from lt
    let lt_name = decodeURI(lt.substring(pos + 1))
    return [a_id, lt_id, lt_name]
  }

  /** Gets the theme ID from a url string
   * @param url_path the url in string format
   * @returns theme ID
   */
  getThemeID(url_path: string): string {

    // Makes a substring of text after the last /
    let t_id: string = url_path.substring(url_path.lastIndexOf("/"))
    // Removes the last /
    t_id = t_id.substring(1);
    // Return the t_id
    return t_id;
  }

  checkLabellingId(url_path: string): boolean {
    let count: number;
    count = (url_path.split("/").length - 1);
    if (count == 4) {
      return true;
    }
    return false;
  }


}
