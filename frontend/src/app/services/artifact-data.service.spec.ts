import { TestBed } from '@angular/core/testing';
import { StringArtifact } from 'app/classes/stringartifact';
import { ArtifactDataService } from './artifact-data.service';

/**
 * Test bed for the artifact data service
 */
describe('ArtifactDataService', () => {
  let service: ArtifactDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtifactDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the artifacts from the backend', async () => {
    // Creates the spy for the get request, and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      {"info": [{
        "artifact": {
          "id": 1,
          "identifier": "id1",
          "data": "text1"
        },
        "artifact_labellings": [[1,2],[3,4]]
        }],
      "nArtifacts": 1,
      "nLabelTypes": 2}
    ));

    // Calls function to be tested
    let result = await service.getArtifacts(1,1,1,1,1);

    // Checks whether spy was called
    expect(spy).toHaveBeenCalled();
    // Checks return values
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    let art = new StringArtifact(1, "id1", "text1");
    art.setLabellings([[1,2], [3, 4]]);
    expect(result[2]).toEqual([art])
  });

  it('should get artifacts, error case', async () => {
    // Calls the function and saves the error
    let error;
    try {
      await service.getArtifacts(0, 0, 0, 0, 0);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("p_id cannot be less than 1"));
  });

  it('should add artifacts, error case 1', async () => {
    // Calls the function and saves the error
    let error;
    try {
      await service.addArtifacts(0, [{a: "a"}, {b: "b"}]);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("p_id cannot be less than 1"));
  });

  it('should add artifacts, error case 2', async () => {
    // Calls the function and saves the error
    let error;
    try {
      await service.addArtifacts(5, []);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("No artifacts have been submitted"));
  });

  it('should add artifacts, error case 3', async () => {
    // Calls the function and saves the error
    let error;
    try {
      await service.addArtifacts(5, [{a: "a"}, {}]);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("Artifacts cannot have empty fields"));
  });

  it('should add artifacts', async () => {
    // Creates a spy for the requesthandler
    let spy = spyOn(service.requestHandler, "post").and.returnValue(Promise.resolve(
      {data: "cool"}
    ));

    // Calls the function
    let result = await service.addArtifacts(3, [{a: "a"}, {b: "b"}])

    // Checks the calls
    expect(spy).toHaveBeenCalledWith('/artifact/creation', 
      { 'p_id': 3, 'artifacts': {'array': [{a: "a"}, {b: "b"}]}}, 
      true);
    expect(result).toEqual({data: "cool"});
  });

  it('should add artifacts but backend returns error', async () => {
    // Creates a spy for the requesthandler
    let spy = spyOn(service.requestHandler, "post").and.throwError(new Error("test error"));
    // Create spy for toast
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Calls the function and saves the error
    let error;
    try {
      await service.addArtifacts(3, [{a: "a"}, {b: "b"}])
    } catch(e) {
      error = e;
    }

    // Checks the calls
    expect(spy).toHaveBeenCalled();
    expect(error).toEqual(new Error("bad formatting"))
    expect(spyToast).toHaveBeenCalledWith([false, "File formatted incorrect."]);
  });

  it('should get artifact, error case 1', async () => {
    // Spies on the session storage and returns null
    spyOn(sessionStorage, "getItem").and.returnValue(null);

    // Calls the function and saves the error
    let error;
    try {
      await service.getArtifact(1, 2);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("User is not logged in"));
  });

  
  it('should get artifact, error case 2', async () => {
    // Spies on the session storage and returns valid token
    spyOn(sessionStorage, "getItem").and.returnValue("something");

    // Calls the function and saves the error
    let error;
    try {
      await service.getArtifact(0, 2);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("p_id cannot be less than 1"));
  });

  it('should get artifact, error case 3', async () => {
    // Spies on the session storage and returns valid token
    spyOn(sessionStorage, "getItem").and.returnValue("something");

    // Calls the function and saves the error
    let error;
    try {
      await service.getArtifact(1, 0);
    } catch(e){
      error = e;
    }

    // Checks the error received
    expect(error).toEqual(new Error("a_id cannot be less than 1"));
  });

  it('should get artifact', async () => {
    // Spies on the session storage and returns valid token
    spyOn(sessionStorage, "getItem").and.returnValue("something");
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      {"artifact": {
        "id": 1,
        "identifier": "abc",
        "data": "some data",
        "parent_id": 5
        },
      "artifact_children": [1,2,3],
      "artifact_labellings": "a",
      "username": "b",
      "u_id": "c",
      "admin": "d",
      "users": "e"
      }
    ))

    // Calls the function and saves the return value
    let result = await service.getArtifact(1, 1);

    // Checks the error received
    expect(spy).toHaveBeenCalled();
    let dummy = new StringArtifact(1, "abc", "some data");
    dummy.setParentId(5);
    dummy.setChildIds([1,2,3]);
    expect(result).toEqual({
      "result": dummy,
      "labellings": "a",
      "username": "b",
      "u_id": "c",
      "admin": "d",
      "users": "e"
    });
  });

  it('should get a random artifact', async () => {
    // Creates a spy on the get call and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      {artifact: {
        id: 2,
        identifier: "abc",
        data: "data"
      },
      childIds: [1,2,3],
      parentId: 3}
    ));

    // Calls the function which we are testing
    let result = await service.getRandomArtifact(1);

    // Checks the data received and the calls made
    expect(spy).toHaveBeenCalled();
    let dummy = new StringArtifact(2, "abc", "data");
    dummy.setChildIds([1,2,3]);
    dummy.setParentId(3);
    expect(result).toEqual(dummy);
  });

  it('should get the labellers', async () => {
    // Creates a spy on the get call and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(true));

    // Calls the function which we are testing
    let result = await service.getLabellers(1, 2);

    // Checks the data received and the calls made
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(true);
  });

  it('should get the artifacts matching the search', async () => {
    // Creates the spy for the get request, and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      [{
        "artifact": {
          "id": 1,
          "identifier": "id1",
          "data": "text1"
        },
        "artifact_labellings": [[1,2],[3,4]]
      }]
    ));

    // Calls function to be tested
    let result = await service.search("a",1);

    // Checks whether spy was called
    expect(spy).toHaveBeenCalled();
    // Checks whether the return data is correct
    let art = new StringArtifact(1, "id1", "text1");
    art.setLabellings([[1,2], [3, 4]]);
    expect(result).toEqual([art])
  });

  it('should call the functions within postHighlight correctly', async () => {
    // Creates a spy on the get call and returns dummy data
    let spy = spyOn(service.requestHandler, "post");

    // Calls the function which we are testing
    await service.postHighlights(1,2,3);

    // Checks the data received and the calls made
    expect(spy).toHaveBeenCalledWith('/artifact/newHighlights', {p_id: 1, a_id: 2, u_id: 3,}, true);
  });

  it('should call the functions within postSplit correctly', async () => {
    // Creates a spy on the get call and returns dummy data
    let spy = spyOn(service.requestHandler, "post");

    // Calls the function which we are testing
    await service.postSplit(1,2,"3",4,5,"6");

    // Checks the data received and the calls made
    expect(spy).toHaveBeenCalledWith('/artifact/split',  
      {p_id: 1, parent_id: 2, identifier: "3", start: 4, end: 5, data: "6"}, true);
  });




});