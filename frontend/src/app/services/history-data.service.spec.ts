import { TestBed } from '@angular/core/testing';

import { HistoryDataService } from './history-data.service';

describe('HistoryDataService', () => {
  let service: HistoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
