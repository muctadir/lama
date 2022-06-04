import { TestBed } from '@angular/core/testing';

import { ArtifactServiceService } from './artifact-service.service';

describe('ArtifactServiceService', () => {
  let service: ArtifactServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtifactServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
