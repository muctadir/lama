import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddArtifactComponent } from './add-artifact.component';

describe('AddArtifactComponent', () => {
  let component: AddArtifactComponent;
  let fixture: ComponentFixture<AddArtifactComponent>;

  // Array of artifact strings
  let artifacts: Array<string> = ["Here is one artifact",
    "And here is a second artifact", "Finally, this is the last artifact."];

  // Array with artifact information
  let artifact_info = [
    {
      'data': artifacts[0],
      'p_id': 1
    },
    {
      'data': artifacts[1],
      'p_id': 1
    }, {
      'data': artifacts[2],
      'p_id': 1

    }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule],
      declarations: [AddArtifactComponent],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests that onChange works correctly
  it('should store the file and set the project id', () => {
    // Initialize an event variable
    let event = new Event("Test event");
    // Initalize an HTMLInputElement instance
    let input = document.createElement('input');
    // Initialize a file
    let file = new File([], "Test file");
    // Make a FileList with file
    let dt = new DataTransfer();
    dt.items.add(file);
    let file_list = dt.files;

    // Spy on event.target and return input
    spyOnProperty(event, 'target').and.returnValue(input);
    // Spy on input.files and return file_list
    spyOnProperty(input, 'files').and.returnValue(file_list);

    // Call the function
    component.onChange(event);

    // Checks that the file and the project id have been set correctly
    expect(component.file).toEqual(file);
  })

  // Tests that onChange does not modify file and p_id if no input is detected
  it('should store the file and set the project id', () => {
    // Initialize an event variable
    let event = new Event("Test event");
    // Initalize an HTMLInputElement instance
    let input = document.createElement('input');
    // Make an empty FileList
    let dt = new DataTransfer();
    let file_list = dt.files;

    // Spy on event.target and return input
    spyOnProperty(event, 'target').and.returnValue(input);
    // Spy on input.files and return file_list
    spyOnProperty(input, 'files').and.returnValue(file_list);

    // Call the function
    component.onChange(event);

    // Checks that the file and the project id have not been modified
    expect(component.file).toEqual(null);
  })

  // Tests if fileUpload works correctly
  it('should send artifacts to the backend', async () => {
    // Set the p_id
    component.p_id = 1;
    // When readFile is called, return the following list of artifacts:
    spyOn<any>(component, 'readFile').and.returnValue(Promise.resolve(artifacts))
    // Spy on the addArtifacts function and stub the call
    spyOn(component, 'addArtifacts');

    // Call the function and wait until it's done
    await component.fileUpload();
    // Check that the right artifacts are sent to the backend
    expect(component.addArtifacts).toHaveBeenCalledWith(1, artifact_info)
  })

  // Tests if fileUpload reacts correctly when no artifacts are uploaded
  it('should set the error variable to true and display the no artifacts failure toast', async () => {
    // Set the p_id
    component.p_id = 1;
    // When readFile is called, return an empty list:
    spyOn<any>(component, 'readFile').and.returnValue(Promise.resolve([]))
    // Spy on the addArtifacts function and stub the call
    spyOn(component, 'addArtifacts');
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')

    // Call the function and wait until it's done
    await component.fileUpload()
    // Check that the addArtifacts was not called
    expect(component.addArtifacts).not.toHaveBeenCalled();
    // Check that an error was detected
    expect(component.error).toEqual(true)
    // Check that an error toast was displayed
    expect(toast_spy)
      .toHaveBeenCalledWith([false, "No artifacts were uploaded"]);
  })

  // Tests if fileUpload reacts correctly when readFile throws an error
  it('should set the error variable to true and display the upload error failure toast', async () => {
    // Set the p_id
    component.p_id = 1;
    // When readFile is called, throw an error:
    spyOn<any>(component, 'readFile').and.throwError("Test error");
    // Spy on the addArtifacts function and stub the call
    let spy = spyOn(component, 'addArtifacts');
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')

    // Call the function and wait until it's done
    await component.fileUpload()
    // Check that the addArtifacts was not called
    expect(spy).not.toHaveBeenCalled();
    // Check that an error was detected
    expect(component.error).toEqual(true)
    // Check that an error toast was displayed
    expect(toast_spy)
      .toHaveBeenCalledWith([false, "Error uploading artifacts"]);
  })

  // Tests if addArtifacts works correctly if user is admin
  it('should display success toast only', async () => {
    // Hardcoded response for artifactDataService.addArtifacts
    let response = { 'admin': true, 'identifier': 'IDENT' }
    // Spy on artifactDataService.addArtifacts and return the following value:
    let artifact_spy = spyOn(component['artifactDataService'], 'addArtifacts').and
      .returnValue(Promise.resolve(response));
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')

    // Call the funciton and wait until it's done
    await component.addArtifacts(1, artifact_info)
    // Check that artifactDataService.addArtifacts was called with the right parameters
    expect(artifact_spy).toHaveBeenCalledWith(1, artifact_info);
    // Check that the success toast was displayed
    expect(toast_spy)
      .toHaveBeenCalledWith([true,
        "Upload successful. Artifact identifier: ".concat(response['identifier'])]);
    // Check that the not admin toast was not displayed
    expect(toast_spy).not
      .toHaveBeenCalledWith([false,
        "You are not admin, so you will not be able to see the artifacts you have not labelled"]);
    // Check that error was set to false
    expect(component.error).toEqual(false);
  })

  // Tests if addArtifacts works correctly if user is not admin
  it('should display success toast only', async () => {
    // Hardcoded response for artifactDataService.addArtifacts
    let response = { 'admin': false, 'identifier': 'IDENT' }
    // Spy on artifactDataService.addArtifacts and return the following value:
    let artifact_spy = spyOn(component['artifactDataService'], 'addArtifacts').and
      .returnValue(Promise.resolve(response));
    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')

    // Call the funciton and wait until it's done
    await component.addArtifacts(1, artifact_info)
    // Check that artifactDataService.addArtifacts was called with the right parameters
    expect(artifact_spy).toHaveBeenCalledWith(1, artifact_info);
    // Check that the success toast was displayed
    expect(toast_spy)
      .toHaveBeenCalledWith([true,
        "Upload successful. Artifact identifier: ".concat(response['identifier'])]);
    // Check that the not admin toast was displayed
    expect(toast_spy)
      .toHaveBeenCalledWith([false,
        "You are not admin, so you will not be able to see the artifacts you have not labelled"]);
    // Check that error was set to false
    expect(component.error).toEqual(false);
  })

  // Tests that the readFile function works correctly
  it('should return the array of artifacts', async () => {
    // Create a plaintext file for testing
    let blob = new Blob(["Test string\nAnother string"], { type: 'text/plain' });
    let file = blob as File;
    // Set the file in the component
    component.file = file;

    // Call the function and wait until it's done
    let result = await component.readFile()
    // Check that the readFile function returns the right artifacts
    expect(result).toEqual(["Test string", "Another string"]);
  })

  // Tests that readFile displays error toasts when needed
  it('should display the invalid file type toast', async () => {
    // Create a non-plaintext file for testing
    let blob = new Blob(["Test string\nAnother string"], { type: 'text/html' });
    let file = blob as File;
    // Set the file in the component
    component.file = file;

    // Spy on toastCommService.emitChange and stub the call
    let toast_spy = spyOn(component['toastCommService'], 'emitChange')

    // Call the function and wait until it's done
    component.readFile()
    // Check that the invalid file type toast is displayed
    expect(toast_spy).toHaveBeenCalledWith([false, "Invalid file type, should be .txt"])
  })
});
