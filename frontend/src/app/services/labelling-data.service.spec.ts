import { TestBed } from '@angular/core/testing';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { Theme } from 'app/classes/theme';
import { labels } from 'app/static-test-info';
import { LabellingDataService } from './labelling-data.service';

/**
 * Test bed for the labelling data service
 */
fdescribe('LabellingDataService', () => {
  let service: LabellingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabellingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the labels from the backend', async () => {
    // creates the spy which stubs the get request and returns dummy label data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve([
      { label: {
        id: 1,
        name: "label1",
        description: "desc1"
        }, 
        label_type: "lt1"
      }, 
      { label: {
        id: 2,
        name: "label2",
        description: "desc2"
        }, 
        label_type: "lt2"
      }
    ]))

    // Calls the function to be tested and stores the results
    let result = await service.getLabels(1);

    // Checks whether the correct calls were made, and correct return value
    expect(spy).toHaveBeenCalled();
    let l1 = new Label(1, "label1", "desc1", "lt1");
    let l2 = new Label(2, "label2", "desc2", "lt2");
    expect(result).toEqual([l1, l2]);
  });


  it('should get the label from the backend', async () => {
    // creates the spy which stubs the call and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      { label: {
        id: 1,
        name: "label1",
        description: "desc1"
        }, 
        label_type: "lt1",
        themes: [{
          id: 1,
          name: "theme1",
          description: "desct1"
        },
        {
          id: 2,
          name: "theme2",
          description: "desct2"
        }]
      }
    ))

    // calls the backend for the label and stores the result
    let result = await service.getLabel(1,2);

    // Checks whether the correct functions are called and the correct result is given
    expect(spy).toHaveBeenCalled();
    let label = new Label(1, "label1", "desc1", "lt1");
    let t1 = new Theme(1, "theme1", "desct1");
    let t2 = new Theme(2, "theme2", "desct2");
    label.setThemes([t1, t2]);
    expect(result).toEqual(label);
  });

  it('should get the labellings', async () => {
    // Creates the spy for the request handler 
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(true));

    // calls the getLabelling function and stores the result
    let result = await service.getLabelling(1,2);

    // Checks the results
    expect(spy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should get the label types', async () => {
    // Creates the spy for the request handler
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve([
      {
        id: 1,
        name: "name1"
      },
      {
        id: 2,
        name: "name2"
      }
    ]));

    // calls the getLabelling function and stores the result
    let result = await service.getLabelTypes(1);

    // Checks the results
    expect(spy).toHaveBeenCalled();
    let lt1 = new LabelType(1, "name1", []);
    let lt2 = new LabelType(2, "name2", []);
    expect(result).toEqual([lt1, lt2]);
  });

  it('should submit a label to the backend', async () => {
    // Creates a dummy data
    let label = new Label(1, "label1", "desc1", "type1");

    // Creates a spy on the backend call
    let spy = spyOn(service.requestHandler, "post");
  
    // Calls the function to be tested
    await service.submitLabel(8, label, 3);

    let result = {
      labelTypeId: 3,
      labelName: "label1",
      labelDescription: "desc1",
      p_id: 8,}

    // Checks whether spy is called with the correct parameters
    expect(spy).toHaveBeenCalledWith('/label/create', result, true);
  });

  it('should edit a label in the backend', async () => {
    // Creates a dummy data
    let label = new Label(1, "label1", "desc1", "type1");

    // Creates a spy on the backend call
    let spy = spyOn(service.requestHandler, "patch");
  
    // Calls the function to be tested
    await service.editLabel(8, label, 3);

    let result = {
      labelId: 1,
      labelName: "label1",
      labelDescription: "desc1",
      p_id: 8}

    // Checks whether spy is called with the correct parameters
    expect(spy).toHaveBeenCalledWith('/label/edit', result, true);
  });

  it('should get the label types with labels', async () => {
    // Creates a spy on the backend call
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      [{
        labels: [{id: 1, name: "name1", description: "desc1"}, {id: 2, name: "name2", description: "desc2"}],
        label_type: {id: 1, name: "ltname1"}
      },
      {
        labels: [{id: 3, name: "name3", description: "desc3"}, {id: 4, name: "name4", description: "desc4"}],
        label_type: {id: 2, name: "ltname2"}
      }]
    ));
  
    // Calls the function to be tested
    let result = await service.getLabelTypesWithLabels(8);

    // Checks the results
    expect(spy).toHaveBeenCalled();
    let l1 = new Label(1, "name1", "desc1", "ltname1");
    let l2 = new Label(2, "name2", "desc2", "ltname1");
    let l3 = new Label(3, "name3", "desc3", "ltname2");
    let l4 = new Label(4, "name4", "desc4", "ltname2");
    let lt1 = new LabelType(1, "ltname1", [l1, l2]);
    let lt2 = new LabelType(2, "ltname2", [l3, l4]);

    // Checks whether labeltypes have been created correctly
    expect(result).toEqual([lt1, lt2]);
  });

  it('should update the label as an admin', async () => {
    // Creates a spy on the backend call
    let spy = spyOn(service, "editLabelling");
  
    // Calls the function to be tested
    await service.updateLabellings(true, 1, 2, "name1", {});

    // Checks whether the correct functions were called
    expect(spy).toHaveBeenCalledWith(1, 2, {});
  });

  it('should update the label as a reguler user', async () => {
    // Creates a spy on the backend call
    let spy = spyOn(service, "editLabelling");
  
    // Calls the function to be tested
    await service.updateLabellings(true, 1, 2, "karl", {"karl": {"id": 1, "name": "name1"}, "bro": {"id": 2, "name": "name2"}});

    // Checks whether the correct functions were called
    expect(spy).toHaveBeenCalledWith(1, 2, {"karl": {"id": 1, "name": "name1"}, "bro": {"id": 2, "name": "name2"}});
  });

  it('should update the label but an error occurs', async () => {
    // Creates a spy on the backend call
    let spy = spyOn(service, "editLabelling").and.throwError(new Error("test"));
    // Creates a spy on the toastCommService
    let spyToast = spyOn(service["toastCommService"], "emitChange");
  
    // Calls the function to be tested
    await service.updateLabellings(true, 1, 2, "karl", {"karl": {"id": 1, "name": "name1"}});

    // Checks whether the correct functions were called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Something went wrong! Please try again."]);
  });

  it('should update the labelling', async () => {
    // Creates a spy on the backend call
    let spy = spyOn(service, "editLabelling");
    // Creates a spy on the toastCommService
    let spyToast = spyOn(service["toastCommService"], "emitChange");
  
    // Calls the function to be tested
    await service.updateLabellings(true, 1, 2, "karl", {"karl": {"id": 1, "name": "name1"}});

    // Checks whether the correct functions were called
    expect(spy).toHaveBeenCalled();
    expect(spyToast).toHaveBeenCalledWith([false, "Something went wrong! Please try again."]);
  });


});
