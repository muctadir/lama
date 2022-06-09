import { TestBed } from '@angular/core/testing';

import { StatsDataService } from './stats-data.service';

describe('StatsDataService', () => {
  let service: StatsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
