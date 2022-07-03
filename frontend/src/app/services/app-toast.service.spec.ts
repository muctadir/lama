import { TestBed } from '@angular/core/testing';
import { AppToastService } from './app-toast.service';

/**
 * Test suite for the app toasts
 */
describe('AppToastService', () => {
  let service: AppToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new toast to the list', () => {
    // creates the spy
    let spy = spyOn(service["toasts"], "push");

    // Calls the function to add a new toast to the list
    service.show("a");

    // Checks whether the toast was added
    expect(spy).toHaveBeenCalled();
  });

  it('should remove a toast from the list', () => {
    // Initialize some dummy values
    service.toasts = ["c", "a"];

    // creates the spy
    let spy = spyOn(service["toasts"], "filter").and.callThrough();

    // Calls the function to remove a toast from the list
    service.remove("a");

    // Checks whether the toast was removed
    expect(spy).toHaveBeenCalled();
    expect(service.toasts).toEqual(["c"]);
  });

  it('should clear the toast array', () => {
    // Initializes the array
    service.toasts = ["c", "a"];

    // Calls the function to clear the array
    service.clear();

    // Checks whether the toast array is empty
    expect(service.toasts).toEqual([]);
  });

});
