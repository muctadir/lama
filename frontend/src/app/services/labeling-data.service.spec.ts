import { TestBed } from '@angular/core/testing';

import { LabelingDataService } from './labeling-data.service';

describe('LabelingDataService', () => {
  let service: LabelingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
