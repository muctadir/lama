import { TestBed } from '@angular/core/testing';
import { AccountInfoService } from './account-info.service';
import { User } from 'app/classes/user'

describe('AccountInfoService', () => {
  let service: AccountInfoService;

  // Initialize test environment
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountInfoService);
  });

  it('should be created', () => {
    // Check if service was created
    expect(service).toBeTruthy();
  });

  it('Test for userData function', async () => {
    // Spy on the get from the request handler
    let spy = spyOn(service, "userData").and.callFake(async () => {
      // Creates a request for the account information
      let spy1 = spyOn(service['requestHandler'], "get").and.returnValue(Promise.resolve({
        // Fake user response
        "id": 1,
        "username": "user",
        "email": "email",
        "description": "desc",
        "super_admin": false
      }));
      let response: any = await service['requestHandler'].get("/account/information", {}, true);
      expect(spy1).toHaveBeenCalledWith("/account/information", {}, true)

      // Gets the user data from the database response and stores the data
      let user = new User(response['id'], response['username']);
      user.setEmail(response['email']);
      user.setDesc(response['description']);
      user.setType(response['super_admin']);

      // Check if user stuff was set
      expect(user.getId()).toEqual(1);
      expect(user.getUsername()).toEqual("user");
      expect(user.getEmail()).toEqual("email");
      expect(user.getDesc()).toEqual("desc");
      expect(user.getType()).toEqual(false);
    });
    // Call function and check if it was called
    service.userData();
    expect(spy).toHaveBeenCalled();
  });

});
