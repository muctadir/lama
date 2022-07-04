import { TestBed } from '@angular/core/testing';

import { EditModeService } from './edit-mode.service';

/**
 * Test bed for the edit mode service
 */
describe('EditModeService', () => {
  let service: EditModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
