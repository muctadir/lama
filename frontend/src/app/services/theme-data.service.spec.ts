import { TestBed } from '@angular/core/testing';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { StringArtifact } from 'app/classes/stringartifact';
import { ThemeDataService } from './theme-data.service';
import { AxiosError } from 'axios';

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

// Class used to create custom AxiosErrors
export class TestAxiosError extends AxiosError {
  override response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

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

  it('should get the themes from the backend', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "get").and.returnValue(Promise.resolve(
      [
        {
          "theme": {
            "id": 1,
            "name": "theme1",
            "description": "tdesc1"
          },
          "number_of_labels": 8,
        },
        {
          "theme": {
            "id": 2,
            "name": "theme2",
            "description": "tdesc2"
          },
          "number_of_labels": 9,
        }
      ]
    ));

    // Call the function
    let result = await service.getThemes(1);

    // Test if the function works
    expect(spy).toHaveBeenCalled();

    // Creates expected output objects
    let t1 = new Theme(1, "theme1", "tdesc1");
    t1.setNumberOfLabels(8);
    let t2 = new Theme(2, "theme2", "tdesc2");
    t2.setNumberOfLabels(9);

    // Checks result against expected output
    expect(result).toEqual([t1, t2]);
  });

  
  it('should get the themes but an error occurs', async () => {
    // Creates the spies
    let spy = spyOn(service['requestHandler'], "get").and.throwError(new Error("testError"));
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Calls the function to be tested
    let result = await service.getThemes(1);

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when trying to get all themes"]);
    expect(result).toEqual([]);
  });

  it('Test for single_theme_info function', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "get").and.returnValue(Promise.resolve(
      {
        "theme": 
        {
          "id": 1,
          "name": "tname1",
          "description": "tdesc1"
        },
        "super_theme": 
        {
          "id": 2,
          "name": "tname2",
          "description": "tdesc2"
        },
        "sub_themes": 
        [
          {
            "id": 3,
            "name": "tname3",
            "description": "tdesc3"
          },
          {
            "id": 4,
            "name": "tname4",
            "description": "tdesc4"
          },
        ],
        "labels": 
        [
          {
            "label": 
            {
              "id": 1,
              "name": "lname1",
              "description": "ldesc1",
            },
            "label_type": "type1",
            "artifacts": 
            [
              {
                "id": 1,
                "identifier": "a",
                "data": "some data1"
              },
              {
                "id": 2,
                "identifier": "b",
                "data": "some data2"
              }
            ]
          }
        ]
      }
    ));

    // Call the function
    let result = await service.single_theme_info(1, 1);

    // Test if the function works
    expect(spy).toHaveBeenCalled();

    // Creates objects for expected output
    let t = new Theme(1, "tname1", "tdesc1");
    let t_super = new Theme(2, "tname2", "tdesc2");
    let t_sub1 = new Theme(3, "tname3", "tdesc3");
    let t_sub2 = new Theme(4, "tname4", "tdesc4");
    let l1 = new Label(1, "lname1", "ldesc1", "type1");
    let a1 = new StringArtifact(1, "a", "some data1");
    let a2 = new StringArtifact(2, "b", "some data2");
    l1.setArtifacts([a1, a2]);
    
    // Sets some properties
    t.setParent(t_super);
    t.setChildren([t_sub1, t_sub2]);
    t.setLabels([l1]);

    // Checks the output vs the expected output object
    expect(result).toEqual(t);
  });

  it('should get a theme but an error occurs', async () => {
    // Creates the spies
    let spy = spyOn(service['requestHandler'], "get").and.throwError(new Error("testError"));
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Calls the function to be tested
    let result = await service.single_theme_info(1, 5);

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when trying to get the theme information"]);
    expect(result).toEqual(new Theme(0, "", ""));
  });

  it('should create child themes', async () => {
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

    // calls the function which we want to test
    let result = service.createChildren(theme_info);

    // Checks whether the result is equivalent to the expected result
    expect(result).toEqual([theme1, theme2]);
  });

  it('should create the label', async () => {
    // Information for two labels
    let label_info = [
      {
      "label":
        {
          "id": 1,
          "name": "Label 1",
          "description": "Desc 1",
        },
      "label_type": "type1",
      "artifacts": []
      },
      {
      "label":
        {
          "id": 2,
          "name": "Label 2",
          "description": "Desc 2",
        },
      "label_type": "type1",
      "artifacts": []
      }
    ]

    // Create the two labels
    let label1 = new Label(1, "Label 1", "Desc 1", "type1");
    label1.setArtifacts([]);
    let label2 = new Label(2, "Label 2", "Desc 2", "type1");
    label2.setArtifacts([]);

    // Stubs the calls to create artifacts
    spyOn(service, "createArtifacts").and.returnValue([]);

    // Calls the function to be tested
    let result = service.createLabels(label_info);

    // checks whether the result is equivalent to the expected result
    expect(result).toEqual([label1, label2]);
  });

  it('should create the artifacts', async () => {
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

    // Calls the function to be tested
    let result = service.createArtifacts(artifact_info);

    // Checks whether the artifacts have been created successfully
    expect(result).toEqual([artifact1, artifact2]);
  });

  it('should get the themes without parents', async () => {
    // Creates a spy for the backend call
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      [{
        "id": 1,
        "name": "Theme 1",
        "description": "Desc 1"
      }, {
        "id": 2,
        "name": "Theme 2",
        "description": "Desc 2"
      }]
    ));

    // Create the two themes
    let theme1 = new Theme(1, "Theme 1", "Desc 1");
    let theme2 = new Theme(2, "Theme 2", "Desc 2");

    // calls the function which we want to test
    let result = await service.themes_without_parents(1, 2);

    // Checks whether the result is equivalent to the expected result
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual([theme1, theme2]);
  });

  it('should get the themes without parents, but an error occurs', async () => {
    // Creates a spy for the backend call, and throws error
    let spy = spyOn(service.requestHandler, "get").and.throwError(new Error("some error"))
    // creates a spy for the toast
    let spyToast = spyOn(service["toastCommService"], "emitChange")

    // calls the function which we want to test
    let result = await service.themes_without_parents(1, 2);

    // Checks whether the result is equivalent to the expected result
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when trying to get the themes without parents"]);
    expect(result).toEqual([]);
  });

  it('should create the theme succesfully', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.returnValue(Promise.resolve("Theme created"));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Created theme successfully"]);
    expect(response).toEqual("Theme created");
  });

  it('should create a theme, but gets wrong response message', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.returnValue(Promise.resolve("something else"));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "something else"]);
    expect(response).toEqual("something else");
  });
  
  it('should try to create a theme, but an error occurs case 1', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post").and.throwError(new TestError("msg", {status: 511}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains a forbidden character: \\ ; , or #"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to create a theme, but an error occurs case 2', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Input contains leading or trailing whitespaces"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains leading or trailing whitespaces"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to create a theme, but an error occurs case 3', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Theme name already exists"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Theme name already exists"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to create a theme, but an error occurs case 4', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Input contains an illegal character"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains an illegal character"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to create a theme, but an error occurs case 5', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: ":)"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.create_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when trying to create the theme"]);
    expect(response).toEqual("An error occured");
  });

  it('should edit the theme succesfully', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.returnValue(Promise.resolve("Theme edited"));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([true, "Edited theme successfully"]);
    expect(response).toEqual("Theme edited");
  });

  it('should edit a theme, but gets wrong response message', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.returnValue(Promise.resolve("something else"));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "something else"]);
    expect(response).toEqual("something else");
  });
  
  it('should try to edit a theme, but an error occurs case 1', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post").and.throwError(new TestError("msg", {status: 511}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains a forbidden character: \\ ; , or #"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to edit a theme, but an error occurs case 2', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Input contains leading or trailing whitespaces"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains leading or trailing whitespaces"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to edit a theme, but an error occurs case 3', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Theme name already exists"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Theme name already exists"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to edit a theme, but an error occurs case 4', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Input contains an illegal character"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Input contains an illegal character"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to edit a theme, but an error occurs case 5', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: ":)"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An error occured when trying to edit the theme"]);
    expect(response).toEqual("An error occured");
  });

  it('should try to edit a theme, but an error occurs case 6', async () => {
    // Spy on the get from the request handler, throws error
    let spy = spyOn(service['requestHandler'], "post")
      .and.throwError(new TestError("msg", {data: "Your choice of subthemes would introduce a cycle"}));
    // spy for the toast emitted
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Call the function
    let response = await service.edit_theme({});

    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Your choice of subthemes would introduce a cycle"]);
    expect(response).toEqual("An error occured");
  });

  it('should delete a theme successfully', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post");
    // Call the function
    let response = await service.delete_theme(0,0);
    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual("Theme deleted succesfully");
  });
  
  it('should delete a theme, but an error occurs', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service['requestHandler'], "post").and.throwError(new Error("msg"));
    let response = await service.delete_theme(0,0);
    // Test if the function works
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual("An error occured when trying to delete the theme");
  });

  it('should search through the themes', async () => {
    // Makes a spy for the backend call
    let spy = spyOn(service['requestHandler'], "get");

    // calls function to be tested
    await service.search("a", 1,);

    // Checks whether a backend call was made
    expect(spy).toHaveBeenCalled();
  });

  it('should get the data for the visualization', async () => {
    // Makes a spy for the backend call
    let spy = spyOn(service['requestHandler'], "get");

    // calls function to be tested
    await service.themeVisData(1);

    // Checks whether a backend call was made
    expect(spy).toHaveBeenCalled();
  });

  it('should get the data for the visualization, but an AxiosError occurs status 406', async () => {
    // Makes a spy for the backend call
    let spy = spyOn(service['requestHandler'], "get")
      .and.throwError(new TestAxiosError("msg", {status: 406, data: "msg_error"}));
    // Creates a spy for the toast
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // calls function to be tested
    let error;
    try {
      await service.themeVisData(1);
    } catch(e) {
      error = e
    }
    
    // Confirms whether the test case passes
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "msg_error"]);
    expect(error).toEqual(new TestAxiosError("msg", {status: 406, data: "msg_error"}));
  });

  it('should get the data for the visualization, but an AxiosError occurs status 69', async () => {
    // Makes a spy for the backend call
    let spy = spyOn(service['requestHandler'], "get")
      .and.throwError(new TestAxiosError("msg", {status: 69, data: "msg_error"}));
    // Creates a spy for the toast
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // calls function to be tested
    let error;
    try {
      await service.themeVisData(1);
    } catch(e) {
      error = e
    }
    
    // Confirms whether the test case passes
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An unknown error occurred"]);
    expect(error).toEqual(new TestAxiosError("msg", {status: 69, data: "msg_error"}));
  });

  it('should get the data for the visualization, but an AxiosError with response null', async () => {
    // Makes a spy for the backend call
    let spy = spyOn(service['requestHandler'], "get")
      .and.throwError(new TestAxiosError("msg", null));
    // Creates a spy for the toast
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // calls function to be tested
    let error;
    try {
      await service.themeVisData(1);
    } catch(e) {
      error = e
    }
    
    // Confirms whether the test case passes
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An unknown error occurred"]);
    expect(error).toEqual(new TestAxiosError("msg", null));
  });

  it('should get the data for the visualization, but a regular Error occurs', async () => {
    // Makes a spy for the backend call
    let spy = spyOn(service['requestHandler'], "get")
      .and.throwError(new Error("msg"));
    // Creates a spy for the toast
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // calls function to be tested
    let error;
    try {
      await service.themeVisData(1);
    } catch(e) {
      error = e
    }
    
    // Confirms whether the test case passes
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "An unknown error occurred"]);
    expect(error).toEqual(new Error("msg"));
  });
});
