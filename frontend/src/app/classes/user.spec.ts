// Veerle Furst

import { User } from './user';

describe('User', () => {
    // Initial variables
    const id = 1;
    const name = "Name";
    const user = new User(id, name);

    // Getting the id of the user
    it('should return the ID of the user', () => {
        expect(user.getId())
            .toBe(id);
    });

    // Getting the username of the user
    it('should return the username of the user', () => {
        expect(user.getUsername())
            .toBe(name);
    });

    // Setting and getting the email of the user
    it('should return the Email of the user', () => {
        const email = "test@gmail.com"
        user.setEmail(email)
        expect(user.getEmail())
            .toBe(email);
    });

    // Setting a bad username
    it('should throw an error for bad label name', () => {
        // Create instances
        const user2 = new User(2, name);
        const newUsername = "";
        // catch wrong name
        let error
        try {
            user2.setUsername(newUsername);
        } catch (e) {
            error = e
        }
        expect(error).toEqual(new Error("The username should not be of length 0 as an argument in setUserame()"));
    });

    // Setting and getting the description of the user
    it('should return the description of the user', () => {
        const desc = "Test"
        user.setDesc(desc)
        expect(user.getDesc())
            .toBe(desc);
    });

    // Setting and getting the status of the user
    it('should return the status of the user', () => {
        const status = "approved"
        user.setStatus(status)
        expect(user.getStatus())
            .toBe(status);
    });

    // Setting and getting the type of the user
    it('should return the type of the user', () => {
        const type = true
        user.setType(type)
        expect(user.getType())
            .toBe(type);
    });

    // Setting and getting the type of the user
    it('should return the type of the user', () => {
        const type = false
        user.setType(type)
        expect(user.getType())
            .toBe(type);
    });

});
