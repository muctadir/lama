import { TestBed } from '@angular/core/testing';

import { ArtifactDataService } from './artifact-data.service';

describe('ArtifactDataService', () => {
  let service: ArtifactDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtifactDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
