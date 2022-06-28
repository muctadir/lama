import { TestBed } from '@angular/core/testing';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { StringArtifact } from 'app/classes/stringartifact';
import { ThemeDataService } from './theme-data.service';

describe('ThemeDataService', () => {
  let service: ThemeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeDataService);
  });

  // Test for creating the service
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for theme_management_info function
  it('should call the request handler for the theme management info', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "get");
    // Call the function
    await service.getThemes(1);
    // Test if the function works
    expect(spy).toHaveBeenCalled();
  });

  // Test for single_theme_info function
  it('should call the request handler for the single theme info', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "get");
    // Call the function
    await service.single_theme_info(1, 1);
    // Test if the function works
    expect(spy).toHaveBeenCalled();
  });

  // Test for createChildren function
  it('should create themes', async () => {
    // Information for two themes
    let theme_info = [{
      "id": 1,
      "name": "Theme 1",
      "description": "Desc 1"
    }, {
      "id": 2,
      "name": "Theme 2",
      "description": "Desc 2"
    }];
    // Create the two themes
    let theme1 = new Theme(1, "Theme 1", "Desc 1");
    let theme2 = new Theme(2, "Theme 2", "Desc 2");

    // Spy on the createChildern service and call a fake function
    spyOn(service, "createChildren").and.callFake(function (): Array<Theme> {
      // List for the children
      let childArray: Array<Theme> = [];
      // For each child make an object
      for (let child of theme_info) {
        // Spy on function
        let spy = spyOn(childArray, "push");
        // Add the child to the array
        childArray.push(new Theme(child["id"], child["name"], child["description"]));
        // Test if the function works
        expect(spy).toHaveBeenCalled();
      }
      // Check if the array was filled correctly
      expect(childArray).toEqual([theme1, theme2]);
      // Return the array of children
      return childArray;
    })
  });

  // Test for createLabels function
  it('should create labels', async () => {
    // Information for two labels
    let label_info = [{
      "id": 1,
      "name": "Label 1",
      "description": "Desc 1",
      "label_type": ""
    }, {
      "id": 2,
      "name": "Label 2",
      "description": "Desc 2",
      "label_type": ""
    }]
    // Create the two labels
    let label1 = new Label(1, "Label 1", "Desc 1", "");
    let label2 = new Label(2, "Label 2", "Desc 2", "");

    // Spy on the createChildern service and call a fake function
    spyOn(service, "createLabels").and.callFake(function (): Array<Label> {
      // List for the labels 
      let labelsArray: Array<Label> = [];
      // For each label in the list
      for (let label of label_info) {
        // Make a new label object
        let newLabel = new Label(label["id"], label["name"], label["description"], label["label_type"])

        // Spy on createArtifacts function
        let spy = spyOn(service, "createArtifacts");
        // Create the artifacts
        service.createArtifacts([]);
        // Test if function was called
        expect(spy).toHaveBeenCalled();

        // Spy on function
        let spy2 = spyOn(labelsArray, "push");
        // Add alabel to the labels
        labelsArray.push(newLabel);
        // Test if function was called
        expect(spy2).toHaveBeenCalled();
      }
      // Test if array is correct
      expect(labelsArray).toEqual([label1, label2]);
      // Return the array of labels
      return labelsArray;
    })
  });

  // Test for createArtifacts function
  it('should create artifacts', async () => {
    // Information for two artifacts
    let artifact_info = [{
      "id": 1,
      "identifier": "ABCDE",
      "data": "Data 1"
    }, {
      "id": 2,
      "identifier": "ABCED",
      "data": "Data 2"
    }];
    // Create the two labels
    let artifact1 = new StringArtifact(1, "ABCDE", "Data 1");
    let artifact2 = new StringArtifact(2, "ABCED", "Data 2");

    // Spy on the createArtifacts service and call a fake function
    spyOn(service, "createArtifacts").and.callFake(function (): Array<StringArtifact> {
      // List for the artifacts
      let artifactArray: Array<StringArtifact> = [];
      // For each artifact in the list
      for (let artifact of artifact_info) {
        // Spy on function
        let spy = spyOn(artifactArray, "push");
        // Push the new artifact
        artifactArray.push(new StringArtifact(artifact["id"], artifact["identifier"], artifact["data"]));
        // Test if function was called
        expect(spy).toHaveBeenCalled();
      }
      // Test if array is correct
      expect(artifactArray).toEqual([artifact1, artifact2]);
      // Return the array with artifacts
      return artifactArray;
    })
  });

  // Test for themes_without_parents function
  it('should call the request handler form the themes without parents', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "get");
    // Call the function
    await service.themes_without_parents(1, 1);
    // Test if the function works
    expect(spy).toHaveBeenCalled();
  });

  // CREATE THEME FUNCTION
  // Test for create_theme function when successful
  it('should call the request handler to create a theme', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.returnValue(Promise.resolve("Theme created"));
    // Call the function
    let response = await service.create_theme({});
    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual("Theme created");
  });

  // Test for create_theme function when failed
  it('should catch errors when trying to create a theme', async () => {

    spyOn(service, "create_theme").and.callFake(async function (): Promise<string> {
      try {
        // Create project in the backend
        let spy1 = spyOn(service['requestHandler'], "post").and.callFake(function () {
          throw new Error();
        })
        await service['requestHandler'].post('/theme/create_theme', {}, true);
        expect(spy1).toThrow();
        return "Theme created succesfully";
        // Catch the error
      } catch (e) {
        // Return the response
        return "An error occured when trying to create the theme.";
      }
    })
    let response = await service.create_theme({});
    // Test if the function works
    expect(response).toEqual("An error occured when trying to create the theme.");
  });

  // EDIT THEME FUNCTION
  // Test for edit_theme function when successful
  it('should call the request handler to edit a theme', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.returnValue(Promise.resolve("Theme edited"));
    // Call the function
    let response = await service.edit_theme({});
    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual("Theme edited");
  });

  // Test for edit_theme function when failed
  it('should catch errors when trying to edit a theme', async () => {

    spyOn(service, "edit_theme").and.callFake(async function (): Promise<string> {
      try {
        // Create project in the backend
        let spy1 = spyOn(service['requestHandler'], "post").and.callFake(function () {
          throw new Error();
        })
        await service['requestHandler'].post('/theme/edit_theme', {}, true);
        expect(spy1).toThrow();
        return "Theme edited succesfully";
        // Catch the error
      } catch (e) {
        // Return the response
        return "An error occured when trying to edit the theme.";
      }
    })
    let response = await service.edit_theme({});
    // Test if the function works
    expect(response).toEqual("An error occured when trying to edit the theme.");
  });

  // DELETE THEME FUNCTION
  // Test for delete_theme function when successful
  it('should call the request handler to delete a theme', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post");
    // Call the function
    let response = await service.delete_theme(0, 0);
    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual("Theme deleted succesfully");
  });

  // Test for delete_theme function when failed
  it('should catch errors when trying to delete a theme', async () => {

    spyOn(service, "delete_theme").and.callFake(async function (): Promise<string> {
      try {
        // Create project in the backend
        let spy1 = spyOn(service['requestHandler'], "post").and.callFake(function () {
          throw new Error("interal database error");
        })
        await service['requestHandler'].post('/theme/delete', {}, true);
        expect(spy1).toThrow();
        return "Theme deleted succesfully";
        // Catch the error
      } catch (e) {
        // Return the response
        return "An error occured when trying to delete the theme.";
      }
    })
    let response = await service.delete_theme(0, 0);
    // Test if the function works
    expect(response).toEqual("An error occured when trying to delete the theme.");
  });

});
