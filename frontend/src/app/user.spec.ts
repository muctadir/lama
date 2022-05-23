import { User } from './user';

describe('User', () => {
    let user: User;

    // Initializes the user
    beforeEach(() => {
        user = new User(1, "testname", "test@gmail.com", "This is a test user");
    });

    // Checks whether the id is returned correctly.
    it('Should return the ID of the user', () => {
        expect(user.getId()).toBe(1);
    });

    // Checks whether the username is returned correctly.
    it('Should return the username of the user', () => {
        expect(user.getUsername()).toBe("testname");
    });

    // Checks whether the email is returned correctly.
    it('Should return the Email of the user', () => {
        expect(user.getEmail()).toBe("test@gmail.com");
    });

    // Checks whether the email is returned correctly.
    it('Should return the Email of the user', () => {
        expect(user.getDescription()).toBe("This is a test user");
    });  
    
});
