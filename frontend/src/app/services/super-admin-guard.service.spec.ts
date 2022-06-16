import { TestBed } from '@angular/core/testing';

import { SuperAdminGuardService } from './super-admin-guard.service';

describe('SuperAdminGuardService', () => {
  let service: SuperAdminGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
