import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginGuardService } from '../services/login-guard.service';

/**
 * Test bed for the loginGuard Service
 */
describe('LoginGuardService', () => {
  let service: LoginGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(LoginGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify that is the user is successfully logged in', async () => {
    // creates a spy on the backend call 
    let spy = spyOn(service["accountService"], "makeAuthRequest").and.returnValue(Promise.resolve(true));

    // Calls the function to be tested
    let result = await service.canActivate();

    // Checks the results
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should verify that is the user is not logged in', async () => {
    // creates a spy on the backend call 
    let spy = spyOn(service["accountService"], "makeAuthRequest").and.returnValue(Promise.resolve(false));
    let spyRouter = spyOn(service["router"], "navigate");

    // Calls the function to be tested
    let result = await service.canActivate();

    // Checks the results
    expect(result).toBeFalsy();
    expect(spy).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(["/login"]);
  });
});
