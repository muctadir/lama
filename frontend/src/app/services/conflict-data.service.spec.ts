import { TestBed } from '@angular/core/testing';
import { ConflictDataService } from './conflict-data.service';

/**
 * Test bed for the conflict data service
 */
describe('ConflictDataService', () => {
  let service: ConflictDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConflictDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the conflicts, invalid parameters provided', async () => {
    // Stores the error that will be thrown by the function
    let error;
    try {
      await service.getConflicts(0);
    } catch(e) {
      error = e
    }

    // Checks whether the 2 error are equivalent
    expect(error).toEqual(new Error("p_id cannot be less than 1"));
  });

  it('should get the conflicts', async () => {
    // Creates the spy which will stub the backend call
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(
      [
        {a_id: 1,
        a_data: "data1",
        lt_id: 2,
        lt_name: "data2",
        users: "data3"},
        {a_id: 11,
        a_data: "data11",
        lt_id: 12,
        lt_name: "data12",
        users: "data13"}
      ]
    ))

    // Calls the function to be tested, and stores the returned value
    let result = await service.getConflicts(3);
    
    // Checks the returned values
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual([{
      'conflictName': 1,
      'conflictData': "data1",
      'conflictLTid': 2,
      'conflictLT': "data2",
      'conflictUsers': "data3"
    },
    {
      'conflictName': 11,
      'conflictData': "data11",
      'conflictLTid': 12,
      'conflictLT': "data12",
      'conflictUsers': "data13"
    }])
  });

  it('should get the labels per user', async () => {
    // creates the spy for the requesthandler and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(true));

    // Stores the error that will be thrown by the function
    let result = await service.getLabelPerUser(1,2,3);

    // Checks whether the 2 error are equivalent
    expect(spy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should get the labels per type', async () => {
    // creates the spy for the requesthandler and returns dummy data
    let spy = spyOn(service.requestHandler, "get").and.returnValue(Promise.resolve(true));

    // Stores the error that will be thrown by the function
    let result = await service.getLabelsByType(1,2);

    // Checks whether the 2 error are equivalent
    expect(spy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
  

});
