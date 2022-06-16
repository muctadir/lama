import { TestBed } from '@angular/core/testing';
import { LabellingDataService } from './labelling-data.service';

describe('LabellingDataService', () => {
  let service: LabellingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabellingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
