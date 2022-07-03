import { TestBed } from '@angular/core/testing';
import { AccountInfoService } from './account-info.service';
import { User } from 'app/classes/user'

// Class used to create custom errors
export class TestError extends Error {
  response: any;
  constructor(message?: string, errortype?: any) {
      super(message);
      this.response = errortype;
  }
}

describe('AccountInfoService', () => {
  let service: AccountInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Test for userData function', async () => {
    // Creates a request for the account information
    let spy1 = spyOn(service['requestHandler'], "get").and.returnValue(Promise.resolve({
      // Fake user response
      "id": 1,
      "username": "user",
      "email": "email", 
      "description": "desc",
      "super_admin": false
    }));

    let response: User = await service.userData();
    expect(spy1).toHaveBeenCalledWith("/account/information", {}, true)

    // Gets the user data from the database response and stores the data
    let user = new User(1, "user");
    user.setEmail("email");
    user.setDesc("desc");
    user.setType(false);

    // Check if user stuff was set
    expect(user.getId()).toEqual(1);
    expect(user.getUsername()).toEqual("user");
    expect(user.getEmail()).toEqual("email");
    expect(user.getDesc()).toEqual("desc");
    expect(user.getType()).toEqual(false);
    expect(user).toEqual(response);
  });

  it('should get the users data from the backend', async () => {
    // Creates a spy
    spyOn(service["requestHandler"], "get").and.returnValue(Promise.resolve(
      [{id: 1, username: "name1", email: "one@one.com", description: "desc1"}, 
      {id: 2, username: "name2", email: "two@two.com", description: "desc2"}]
    ));

    // Calls the function
    let result = await service.allUsersData();

    // Creates the dummy result
    let user1 = new User(1, "name1");
    user1.setEmail("one@one.com");
    user1.setDesc("desc1");
    let user2 = new User(2, "name2"); 
    user2.setEmail("two@two.com");
    user2.setDesc("desc2");
    let output = [user1, user2];

    // Checks whether output is correct
    expect(result).toEqual(output);
  });

  it('should get the users data but throws error', async () => {
    // Creates a spy
    spyOn(service["requestHandler"], "get").and.throwError(new Error("test"));

    // Calls the function to be tested and saves the error
    let error;
    try {
      await service.allUsersData();      
    } catch(e) {
      error = e;
    }
  
    // Checks whether output is correct
    expect(error).toEqual(new Error("Could not get data from server"));
  });

  it('should make the backend call to delete a user', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post");

    // Calls the softDelUser function with dummy input
    service.softDelUser(new User(1, "a"));
  
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
  });

  it('should make the backend call to delete a user, but exception is thrown', async () => {
    // Creates a spy
    spyOn(service["requestHandler"], "post").and.throwError(new Error("test"));

    // Calls the softDelUser function with dummy input
    let error;
    try {
      await service.softDelUser(new User(1, "a"));     
    } catch(e) {
      error = e;
    }
  
    // Checks whether output is correct
    expect(error).toEqual(new Error("Could not get the data from server"));
  });

  it('should make the backend call to for permission', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "get");

    // Calls the makeAuthRequest function with dummy input
    let result = await service.makeAuthRequest();
  
    // Checks whether output is correct
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should make the backend call to for permission, returns error', async () => {
    // Creates a spy
    spyOn(service["requestHandler"], "get").and.throwError(new TestError("test", {data: "woop"}));
    let spyToast = spyOn(service["toastCommService"], "emitChange");

    // Calls the makeAuthRequest function
    let result = await service.makeAuthRequest();
  
    // Checks whether output is correct
    expect(result).toBeFalsy();
    expect(spyToast).toHaveBeenCalledWith([false, "woop"]);
  });

  it('should make the backend call to for superadmin permission', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "get");

    // Calls the makeSuperAuthRequest function
    let result = await service.makeSuperAuthRequest();
  
    // Checks whether output is correct
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should make the backend call to for superadmin permission, returns error', async () => {
    // Creates a spy
    spyOn(service["requestHandler"], "get").and.throwError(new Error("test"));

    // Calls the makeSuperAuthRequest function
    let result = await service.makeSuperAuthRequest();
  
    // Checks whether output is correct
    expect(result).toBeFalsy();
  });

  it('should register the user', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post");

    // Calls the register function
    await service.registerUser({data: "test"});
  
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
  });

  it('should register the user, error is thrown', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post").and.throwError(new Error("error msg"));

    // Calls the register function
    let error;
    try {
      await service.registerUser({data: "test"});
    } catch(e) {
      error = e;
    }
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
    expect(error).toEqual(new Error("error msg"));
  });

  it('should login the user', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post");

    // Calls the login function
    await service.loginUser({data: "test"});
  
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
  });

  it('should login the user, error is thrown', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post").and.throwError(new Error("error msg"));

    // Calls the login function
    let error;
    try {
      await service.loginUser({data: "test"});
    } catch(e) {
      error = e;
    }

    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
    expect(error).toEqual(new Error("error msg"));
  });

  it('should change the password of the user', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post");

    // Calls the changePassword function
    await service.changePassword({data: "test"});
  
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
  });

  it('should change the password of the user, error is thrown', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post").and.throwError(new Error("error msg"));

    // Calls the changePassword function
    let error;
    try {
      await service.changePassword({data: "test"});
    } catch(e) {
      error = e;
    }
    
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
    expect(error).toEqual(new Error("error msg"));
  });

  it('should change the user details of the user', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post");

    // Calls the changeAccountDetails function
    await service.changeAccountDetails({data: "test"});
  
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
  });

  it('should change the account details of the user, error is thrown', async () => {
    // Creates a spy
    let spy = spyOn(service["requestHandler"], "post").and.throwError(new Error("error msg"));

    // Calls the changeAccountDetails function
    let error;
    try {
      await service.changeAccountDetails({data: "test"});
    } catch(e) {
      error = e;
    }
    
    // Checks whether output is correct
    expect(spy).toHaveBeenCalled();
    expect(error).toEqual(new Error("error msg"));
  });
  
});
