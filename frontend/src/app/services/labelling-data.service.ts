import { Injectable } from '@angular/core';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
import { Theme } from 'app/classes/theme';
import { User } from 'app/classes/user';
import { RequestHandler } from 'app/classes/RequestHandler';
import { ToastCommService } from './toast-comm.service';

@Injectable({
  providedIn: 'root',
})
export class LabellingDataService {
  // Initialise the Request handler
  requestHandler: RequestHandler;

  /**
   * Constructors for the request handler
   * @param toastCommService instance of ToastCommService
   */
  constructor(private toastCommService: ToastCommService) {
    this.requestHandler = new RequestHandler(
      sessionStorage.getItem('ses_token')
    );
  }

  /**
   * Function to get all the labels from a project
   *
   * @param p_id: number - project id
   * @returns all the labels
   */
  async getLabels(p_id: number): Promise<Array<Label>> {
    // Response from the request handler
    const response = await this.requestHandler.get(
      '/label/allLabels',
      { p_id: p_id },
      true
    );

    // New array of labels
    const result = new Array<Label>();

    // Filling in the array of labels
    response.forEach((r: any) => {
      result.push(
        new Label(r.label.id, r.label.name, r.label.description, r.label_type)
      );
    });

    return result;
  }

  /**
   * Function gets a specific label from a project with its themes
   *
   * @param p_id: number - project id
   * @param label_id: number - label id
   * @returns label from a project with its themes
   */
  async getLabel(p_id: number, label_id: number): Promise<Label> {
    // Response from the request handler
    const response = await this.requestHandler.get(
      '/label/singleLabel',
      { p_id: p_id, label_id: label_id },
      true
    );

    // Get the new label
    const result = new Label(
      response.label.id,
      response.label.name,
      response.label.description,
      response.label_type
    );
    // New array of themes
    let ThemeArray = new Array<Theme>();

    // Push the the themes into the theme array
    response.themes.forEach((r: any) => {
      ThemeArray.push(new Theme(r.id, r.name, r.description));
    });

    // Set the themes
    result.setThemes(ThemeArray);

    return result;
  }

  /**
   * Function to get the labellings per label
   *
   * @param p_id: number - project id
   * @param label_id: number - label id
   * @returns the labelling per label
   */
  async getLabelling(p_id: number, label_id: number): Promise<any> {
    return this.requestHandler.get(
      '/labelling/by_label',
      { p_id: p_id, label_id: label_id },
      true
    );
  }

  /**
   * Function to get all the label types withub a project
   *
   * @param p_id: number - project id
   * @returns all the label ypes in a project
   */
  async getLabelTypes(p_id: number): Promise<Array<LabelType>> {
    // Array of label types
    let result = new Array<LabelType>();

    // Response from the request handler
    let response = await this.requestHandler.get(
      '/labeltype/all',
      { p_id: p_id },
      true
    );
    response.forEach((d: any) => {
      result.push(new LabelType(d.id, d.name, new Array<Label>()));
    });
    return result;
  }

  /**
   * Function to submit the label
   *
   * @param p_id: number - project id
   * @param label: Label
   * @param labelTypeId: number
   */
  async submitLabel(
    p_id: number,
    label: Label,
    labelTypeId: number
  ): Promise<void> {
    // The content of the response
    let content: Object = {
      labelTypeId: labelTypeId,
      labelName: label.getName(),
      labelDescription: label.getDesc(),
      p_id: p_id,
    };

    await this.requestHandler.post('/label/create', content, true);
  }

  /**
   * Function to edit the label
   *
   * @param p_id: number - project id
   * @param label: Label
   * @param labelTypeId: number
   */
  async editLabel(
    p_id: number,
    label: Label,
    labelTypeId: number
  ): Promise<void> {
    // Content of the patch
    let content: Object = {
      labelId: label.getId(),
      labelName: label.getName(),
      labelDescription: label.getDesc(),
      p_id: p_id,
    };

    // Response from the request handler
    await this.requestHandler.patch('/label/edit', content, true);
  }

  /**
   * Function to get the label types with their labels within a project
   *
   * @param p_id: number - project id
   * @returns label types with their labels within a project
   */
  async getLabelTypesWithLabels(p_id: number): Promise<Array<LabelType>> {
    // Array of label types
    let labelTypes: Array<LabelType> = new Array<LabelType>();
    // Response from the request handler
    const response = await this.requestHandler.get(
      '/labeltype/allWithLabels',
      { p_id: p_id },
      true
    );

    // Get the label types with their labels
    response.forEach((r: any) => {
      let labelArray: Array<Label> = new Array<Label>();
      r.labels.forEach((l: any) => {
        labelArray.push(
          new Label(l.id, l.name, l.description, r.label_type.name)
        );
      });
      labelTypes.push(
        new LabelType(r.label_type.id, r.label_type.name, labelArray)
      );
    });

    return labelTypes;
  }

  /**
   * Update the labelling and return + send the updates to the backend
   * 
   * @param admin: bool, whether the user making the updates is admin or not
   * @param p_id: number, the project id 
   * @param a_id : number, the artifact id
   * @param username : string, the username of the user making the updates
   * @param label_per_user: Record<string, Record<string, any>>, a record containing: 
   *  {
   *    u_id: user ID
        id: label ID
        name: label name
        description: label description
        lt_id: label type ID
   *  }
   * @returns a set of the label names in the update 
   */
  async updateLabellings(admin: boolean, p_id: number, a_id: number, username: string,
    label_per_user: Record<string, Record<string, any>>): Promise<void> {
    try {
      // If the current user is admin, send all labellings to the backend
      if (admin) {
        // Send project ID, label type ID, artifact ID and labelling updates to the backend
        this.editLabelling(p_id, a_id, label_per_user)
      }
      // If the current user is not admin, only send the user's labellings to the backend
      else {
        // Record holding a single user's labellings
        let singleUpdate: Record<string, any> = {};
        // Assign the user's labellings to their username
        singleUpdate[username] = label_per_user[username];
        // Send project ID, label type ID, artifact ID and labelling updates to the backend
        this.editLabelling(p_id, a_id, singleUpdate)
      }
    }
    catch (error) {
      // If not posisble to update, sends an error
      this.toastCommService.emitChange([false, "Something went wrong! Please try again."]);
    }
  }

  /**
   * Updates a single labelling 
   * 
   * @param user the username of the user who changed their labelling
   * @param label the name of the label to which the user is changing their labelling
   * @param labels list of labels that the label was selected from
   */
  updateLabelling(user: User, label: string, labels: Array<Label>, lt_id: number): Record<string, any> | null {
    // Placeholder for new label value of labelling
    let selectedLabel: Label;
    try {
      // Getting the label from a given name in the list of labels from this label type
      selectedLabel = this.findLabel(labels, label);
      // Change the labelling in the label_per_user array for user
      return {
        "description": selectedLabel.getDesc(), "name": selectedLabel.getName(),
        "lt_name": selectedLabel.getType(), "id": selectedLabel.getId(), "u_id": user.getId(), "lt_id": lt_id
      };
    } catch (error) {
      // If label couldn't be found, show error
      this.toastCommService.emitChange([false, "Label doesn't exist"]);
      // Return nothing
      return null
    }
  }

  /**
   * Finds a label object in an array of Labels from a given name
   * 
   * @param labels array of labels
   * @param label the name of the label that needs to be found
   */
  findLabel(labels: Label[], label: string): Label {
    //Running through each label in array and see if the label has the same name as (parameter) "label"
    for (let eachLabel of labels) {
      if (eachLabel.getName() == label) {
        return eachLabel
      }
    }
    //Return error if cannot find the label
    throw new Error("Label name invalid")
  }

  /**
   * Function to edit one or multiple labellings
   * @param p_id number, project id
   * @param lt_id number, label type id
   * @param labellings Record<string, string>, record which has usernames as keys 
   *  and the labelling they gave to label type with id lt_id
   */
  async editLabelling(p_id: number, a_id: number, labellings: Record<string, Record<string, any>>) {
    // Make call to backend and get its reponse
    await this.requestHandler.patch('/labelling/edit',
      { 'p_id': p_id, 'a_id': a_id, 'labellings': labellings }, true)
  }

  /**
   * Function to post the labelling
   * @param dict  - dictionary
   */
  async postLabelling(dict: Object): Promise<void> {
    await this.requestHandler.post('/labelling/create', dict, true);
  }

  /**
   * Function to post the merged labels
   * @param dict  - dictionary
   */
  async postMerge(dict: Object): Promise<string> {
    return await this.requestHandler.post('/label/merge', dict, true);
  }

  /**
   * Function to post the soft delete
   * @param dict  - dictionary
   */
  async postSoftDelete(dict: Object): Promise<void> {
    await this.requestHandler.post('/label/delete', dict, true);
  }

  /**
   * Function to get the labelling count
   * @param dict  - dictionary
   */
  async getLabellingCount(dict: Object): Promise<string> {
    return await this.requestHandler.get('/label/count_usage', dict, true);
  }

  // Function for searching in backend
  async search(
    searchWords: string,
    p_id: number
  ): Promise<Array<Record<string, any>>> {
    // Get the label information from the backend
    return this.requestHandler.get(
      '/label/search',
      { p_id: p_id, search_words: searchWords },
      true
    );

  }
}
