import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SuperAdminGuardService } from './super-admin-guard.service';

describe('SuperAdminGuardService', () => {
  let service: SuperAdminGuardService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(SuperAdminGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
