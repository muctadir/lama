import { TestBed } from '@angular/core/testing';

import { ConflictDataService } from './conflict-data.service';

describe('ConflictDataService', () => {
  let service: ConflictDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConflictDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
