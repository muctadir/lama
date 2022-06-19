import { Injectable } from '@angular/core';
import { RequestHandler } from 'app/classes/RequestHandler';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { StringArtifact } from 'app/classes/stringartifact';
import { ToastCommService } from './toast-comm.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeDataService {

  // Request handler variable
  private requestHandler: RequestHandler;
  // Session token variable
  private sessionToken: string | null;
  
  constructor(private toastCommService: ToastCommService) { 
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
    try{
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
    // Catch error
    } catch(e){
      console.log("An error occured when trying to get all themes");
      return [];
    }
  }

  /**
   * Function to get the single theme info
   * 
   * @param p_id 
   * @param t_id 
   * @returns newTheme. all information of a single theme
   */
  async single_theme_info(p_id: number, t_id: number): Promise<Theme> {
    try{
      // Get request to the backend
      let response = await this.requestHandler.get('/theme/single-theme-info', {"p_id": p_id, "t_id": t_id}, true);

      // Get the theme data
      let theme = response["theme"];
      // Get the super-theme data
      let superTheme = response["super_theme"]
      // Get the sub-theme data
      let subThemes = response["sub_themes"];
      // Get the label data
      let labels = response["labels"]

      // Create a new theme object with all information
      let newTheme: Theme = new Theme(theme['id'], theme["name"], theme["description"]);

      // Set the parent
      newTheme.setParent(new Theme(superTheme["id"], superTheme["name"], superTheme["description"]));

      // Add the childern to the theme after creating them
      newTheme.setChildren(this.createChildren(subThemes));

      // Add labels to the theme after creating them
      newTheme.setLabels(this.createLabels(labels));

      // Return the theme
      return newTheme;
    // Catch the error
    } catch(e) {
      console.log("An error occured when trying to get the theme information");
      return new Theme(0, "", "");
    }
  }

  /**
   * Function to create the children
   * 
   * @param subThemes json of sub-themes
   * @returns childArray. array of children themes
   */
  createChildren(subThemes: []): Array<Theme>{
    // List for the children
    let childArray: Array<Theme> = [];
    // For each child make an object
    for (let child of subThemes){
      // Add the child to the array
      childArray.push(new Theme(child["id"], child["name"], child["description"]));
    }
    // Return the array of children
    return childArray;
  }

  /**
   * Function to cerate the labels
   * 
   * @param labels json of labels
   * @returns labelsArray. array of labels
   */
  createLabels(labels: []): Array<Label> {
    // List for the labels 
    let labelsArray: Array<Label> = [];
    // For each label in the list
    for (let label of labels){
      let label_info = label["label"]
      // Make a new label object
      let newLabel = new Label(label_info["id"], label_info["name"], label_info["description"], label["label_type"])

      // Create the artifacts
      let artifactArray = this.createArtifacts(label["artifacts"]);        
      // Add artifacts to the label
      newLabel.setArtifacts(artifactArray);

      // Add alabel to the labels
      labelsArray.push(newLabel)
    }
    // Return the array of labels
    return labelsArray;
  }

  /**
   * Function to create artifacts
   * 
   * @param artifacts json of artifacts 
   * @returns artifactArray. list of artifacts
   */
  createArtifacts(artifacts: []): Array<StringArtifact> {
    // List for the artifacts
    let artifactArray: Array<StringArtifact> = [];
    for (let artifact of artifacts){
      // Push the new artifact
      artifactArray.push(new StringArtifact(artifact["id"], artifact["identifier"], artifact["data"]));
    }
    // Return the array with artifacts
    return artifactArray;
  }

  /**
   * Function to get the themes that have no parents/super-themes
   * 
   * @param p_id 
   * @returns allSubThemes. All sub-themes without parents
   */
  async themes_without_parents (p_id: number, t_id: number): Promise<Array<Theme>> {
    try{
      // Get request to the backend
      let response = await this.requestHandler.get('/theme/possible-sub-themes', {"p_id": p_id, "t_id": t_id}, true);

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
    //Catch the error
    } catch(e) {
      console.log("An error occured when trying to get the themes without parents");
      return [];
    }    
  }

  /**
   * Function to create a theme
   * 
   * @param theme_info Includes name, description, sub_themes, labels, and p_id
   * @returns response. Whether the theme was created or an error occured
   */
  async create_theme (theme_info: any): Promise<string> {
    try{
      // Create project in the backend
      let message = await this.requestHandler.post('/theme/create_theme', theme_info, true);
      // Create a toast indicating whether or not the theme was
      // created successfully
      if(message == "Theme created") {
      this.toastCommService.emitChange([true, "Created theme successfully"]);
      }
      else {
        this.toastCommService.emitChange([false, message]);
      }
      return message
  
    // Catch the error
    } catch (e) {
      // Emits an error toast
      this.toastCommService.emitChange([false, "An error occured when trying to create the theme."]);
      // Return the response
      return "An error occured when trying to create the theme.";
    }
  }
  
  /**
   * Function to edit a theme
   * 
   * @param theme_info Includes id, name, description, sub_themes, labels, and p_id
   * @returns response. Whether the theme was edited or an error occured
   */
   async edit_theme (theme_info: any): Promise<string> {
    try{
      // Create project in the backend
      let message = await this.requestHandler.post('/theme/edit_theme', theme_info, true);
      // Create a toast indicating whether or not the theme was
      // edited successfully
      if(message == "Theme edited") {
        this.toastCommService.emitChange([true, "Edited theme successfully"]);
        }
        else {
          this.toastCommService.emitChange([false, message]);
        }
        return message
    // Catch the error
    } catch(e) {
      // Emits an error toast
      this.toastCommService.emitChange([false, "An error occured when trying to edit the theme"]);
      // Return the response
      return "An error occured when trying to edit the theme";
    }
  }

  /**
   * Function to deleted a theme
   * 
   * @param p_id 
   * @param t_id 
   * @returns response. Whether the theme was deleted or an error occured
   */
  async delete_theme(p_id: number, t_id: number): Promise<string> {
    try{
      // Create project in the backend
      await this.requestHandler.post('/theme/delete_theme', {"p_id": p_id, "t_id": t_id}, true);
      return "Theme deleted succesfully"
    // Catch the error
    } catch(e) {
      // Return the response
      return "An error occured when trying to delete the theme";
    }
  }

}
