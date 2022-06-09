import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';
import axios from 'axios';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { StringArtifact } from 'app/classes/stringartifact';

@Injectable({
  providedIn: 'root'
})
export class ThemeDataService {

  // Request handler variable
  private requestHandler: RequestHandler;
  // Session token variable
  private sessionToken: string | null;
  
  constructor() { 
    // Get the session token
    this.sessionToken = sessionStorage.getItem("ses_token");
    // Make the request handler
    this.requestHandler = new RequestHandler(this.sessionToken)
  }

  /**
   * Function to get the theme management info
   * 
   * @param p_id 
   * @returns themes_list. List of themes. Each theme includes the oject and the number of labels within the theme
   */
  async theme_management_info(p_id: number): Promise<Array<Theme>> {
    // Get request to the backend
    let response = await this.requestHandler.get('/theme/theme-management-info', {"p_id": p_id}, true);

    // Get the response data
    let themes = response;

    // List of all themes
    let themes_list: Array<Theme> = []

    // For each theme in the list
    for (let theme of themes){

      // Get the theme information
      let themeJson = theme["theme"];
      themeJson["numberOfLabels"] = theme["number_of_labels"];

      // Create a new theme object with all information
      let newTheme: Theme = new Theme(themeJson['id'], themeJson["name"], themeJson["description"]);

      // Put labels in the theme
      newTheme.setNumberOfLabels(themeJson["numberOfLabels"]) 

      // Add theme to list
      themes_list.push(newTheme);
    }
    // Return the list of themes
    return themes_list;
  }

  /**
   * Function to get the single theme info
   * 
   * @param p_id 
   * @param t_id 
   * @returns newTheme. all information of a single theme
   */
  async single_theme_info(p_id: number, t_id: number): Promise<Theme> {
    // Get request to the backend
    let response = await this.requestHandler.get('/theme/single-theme-info', {"p_id": p_id, "t_id": t_id}, true);

    // Get the response data
    let themeInfo = response;

    // Get the theme data
    let theme = themeInfo["theme"];
    // Get the super-theme data
    let superTheme = themeInfo["super_theme"]
    // Get the sub-theme data
    let subThemes = themeInfo["sub_themes"];
    // Get the label data
    let labels = themeInfo["labels"]

    // Create a new theme object with all information
    let newTheme: Theme = new Theme(theme['id'], theme["name"], theme["description"]);

    // Set the parent
    newTheme.setParent(new Theme(superTheme["id"], superTheme["name"], superTheme["description"]));

    // CHILDREN
    // List for the children
    let childArray: Array<Theme> = [];
    // For each child make an object
    for (let child of subThemes){
      // Add the child to the array
      childArray.push(new Theme(child["id"], child["name"], child["description"]));
    }
    // Add the childern to the theme
    newTheme.setChildren(childArray);

    // LABELS
    // List for the labels 
    let labelsArray: Array<Label> = [];
    // For each label in the list
    for (let label of labels){
      let label_info = label["label"]
      // Make a new label object
      let newLabel = new Label(label_info["id"], label_info["name"], label_info["description"], label["label_type"])

      // ARTIFACTS
      // List for the artifacts
      let artifactArray: Array<StringArtifact> = [];
      for (let artifact of label["artifacts"]){
        // Push the new artifact
        artifactArray.push(new StringArtifact(artifact["id"], artifact["identifier"], artifact["data"]));
      }
      // Add artifacts to the label
      newLabel.setArtifacts(artifactArray);

      // Add alabel to the labels
      labelsArray.push(newLabel)
    }
    // Add labels to the theme
    newTheme.setLabels(labelsArray);

    return newTheme;
  }

  /**
   * Function to get the theme management info
   * 
   * @param p_id 
   * @returns allSubThemes. All sub-themes without parents
   */
  async themes_without_parents (p_id: number): Promise<Array<Theme>> {
    // Get request to the backend
    let response = await this.requestHandler.get('/theme/possible-sub-themes', {"p_id": p_id}, true);

    // List for all subthemes
    let allSubThemes: Array<Theme> = [];
    // For each subtheme make a Theme object
    for (let subtheme of response){
      let newTheme = new Theme (subtheme['id'], subtheme['name'], subtheme['description']);
      // Push the subthemes to a list
      allSubThemes.push(newTheme);
    }
    // Return the list of subThemes
    return allSubThemes
  }

  /**
   * Function to get the theme management info
   * 
   * @param theme_info 
   * @returns response
   */
  async create_theme (theme_info: any): Promise<string> {
    // Create project in the backend
    let response =  await this.requestHandler.post('/theme/create_theme', theme_info, true);
    // Return the response
    return response;
  }

}
