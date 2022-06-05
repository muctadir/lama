// Veerle Furst

import { User } from './user';

describe('User', () => {
    // Initial variables
    const id = 1;
    const name = "Name";
    const user = new User(id, name);

    // Getting the id of the user
    it('Should return the ID of the user', () => {
        expect(user.getId())
            .toBe(id);
    });

    // Getting the username of the user
    it('Should return the username of the user', () => {
        expect(user.getUsername())
            .toBe(name);
    });

    // Setting and getting the email of the user
    it('Should return the Email of the user', () => {
        const email = "test@gmail.com"
        user.setEmail(email)
        expect(user.getEmail())
            .toBe(email);
    });

    // Setting and getting the description of the user
    it('Should return the description of the user', () => {
        const desc = "Test"
        user.setDescription(desc)
        expect(user.getDescription())
            .toBe(desc);
    });

    // Setting and getting the status of the user
    it('Should return the status of the user', () => {
        const status = "approved"
        user.setStatus(status)
        expect(user.getStatus())
            .toBe(status);
    });

    // Setting and getting the type of the user
    it('Should return the type of the user', () => {
        const type = "user"
        user.setType(type)
        expect(user.getType())
            .toBe(type);
    });

});
