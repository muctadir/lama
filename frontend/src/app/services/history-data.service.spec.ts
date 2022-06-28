import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Changelog } from 'app/classes/changelog';
import { HistoryDataService } from './history-data.service';

/**
 * Test bed for the history data service
 */
fdescribe('HistoryDataService', () => {
  let service: HistoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(HistoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the changelogs of a theme', async () => {
    // Spies on the current url
    spyOnProperty(service["router"], "url", "get").and.returnValue("project/5/theme/8");
    let spy = spyOn(service["requestHandler"], "get").and.returnValue(Promise.resolve([
      {"username": "a", "timestamp": "aa", "description": "aaa"},
      {"username": "b", "timestamp": "bb", "description": "bbb"}
    ]));

    // Calls the function that we will be testing, and saves the returned data
    let result = await service.getHistory("Theme");

    // Checks the conditions that need to be hold
    expect(spy).toHaveBeenCalled();
    let cl1 = new Changelog("a", "aa", "aaa");
    let cl2 = new Changelog("b", "bb", "bbb");
    expect(result).toEqual([cl1, cl2]);
  });

  it('should get the changelogs of a label', async () => {
    // Spies on the current url
    spyOnProperty(service["router"], "url", "get").and.returnValue("project/5/label/8");
    let spy = spyOn(service["requestHandler"], "get").and.returnValue(Promise.resolve([
      {"username": "a", "timestamp": "aa", "description": "aaa"}
    ]));

    // Calls the function that we will be testing, and saves the returned data
    let result = await service.getHistory("Label");

    // Checks the conditions that need to be hold
    expect(spy).toHaveBeenCalled();
    let cl1 = new Changelog("a", "aa", "aaa");
    expect(result).toEqual([cl1]);
  });

  it('should get the changelogs of artifacts', async () => {
    // Spies on the current url
    spyOnProperty(service["router"], "url", "get").and.returnValue("project/5/artifact/8");
    let spy = spyOn(service["requestHandler"], "get").and.returnValue(Promise.resolve([
      {"username": "a", "timestamp": "aa", "description": "aaa"},
      {"username": "b", "timestamp": "bb", "description": "bbb"},
      {"username": "c", "timestamp": "cc", "description": "ccc"}
    ]));

    // Calls the function that we will be testing, and saves the returned data
    let result = await service.getHistory("Artifact");

    // Checks the conditions that need to be hold
    expect(spy).toHaveBeenCalled();
    let cl1 = new Changelog("a", "aa", "aaa");
    let cl2 = new Changelog("b", "bb", "bbb");
    let cl3 = new Changelog("c", "cc", "ccc");
    expect(result).toEqual([cl1, cl2, cl3]);
  });

  it('should get the changelogs of non existant item', async () => {
    // Spies on the current url
    spyOnProperty(service["router"], "url", "get").and.returnValue("project/5/artifact/8");
    
    // Calls the function that we will be testing, and saves the returned data
    let error;
    try {
      await service.getHistory("test");
    } catch(e) {
      error = e;
    }
    
    // Checks the conditions that need to be hold
    expect(error).toEqual(new Error("invalid input given"));
  });


});
