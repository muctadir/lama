import { TestBed } from '@angular/core/testing';

import { ReroutingService } from './rerouting.service';

describe('ReroutingService', () => {
  let service: ReroutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReroutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
