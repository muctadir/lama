import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SuperAdminGuardService } from './super-admin-guard.service';

/**
 * Test bed for the super admin guard service
 */
describe('SuperAdminGuardService', () => {
  let service: SuperAdminGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(SuperAdminGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should indicate that the user is logged in as a superadmin', async () => {
    // Creates the spy 
    let spy = spyOn(service["accountService"], "makeSuperAuthRequest").and.returnValue(Promise.resolve(true));

    // Calls the function which we have to test
    let result = await service.canActivate();

    // Does some checks
    expect(spy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should indicate that the user is not logged in as a superadmin', async () => {
    // Creates the spies 
    let spy = spyOn(service["accountService"], "makeSuperAuthRequest").and.returnValue(Promise.resolve(false));
    let spyRoute = spyOn(service["router"], "navigate");

    // Calls the function which we have to test
    let result = await service.canActivate();

    // Does some checks
    expect(spy).toHaveBeenCalled();
    expect(spyRoute).toHaveBeenCalledWith(["/home"]);
    expect(result).toBeFalsy();
  });

});
