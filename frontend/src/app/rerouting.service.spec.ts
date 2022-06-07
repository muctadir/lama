import { TestBed } from '@angular/core/testing';

import { ReroutingService } from './rerouting.service';

describe('ReroutingService', () => {
  let service: ReroutingService;

  // Initializes the Rerouting service
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReroutingService);
  });

  // Checks whether the service is created correctly
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Checks whether the pid is obtained correctly in regular input
  it('Checks whether the pid is obtained correctly in regular input', () => {
    let result = service.getProjectID("/something/8/somethingelse");
    expect(result).toBe("8");
  });

  // Checks whether the pid is obtained correctly in longer input
  it('Checks whether the pid is obtained correctly in longer input', () => {
    let result = service.getProjectID("/something/7/somethingelse/anotherarg");
    expect(result).toBe("7");
  });

  // Checks whether it behaves when first / is missing
  it('Checks whether it behaves when first / is missing', () => {
    let result = service.getProjectID("something/7/somethingelse");
    expect(result).toBe("7");
  });


});
