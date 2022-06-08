// Veerle Furst

import { Labelling } from './labelling';
import { Label } from './label';

describe('Labelling', () => {
  // Initialization variables
  const userId = 1;
  const username = "Test";
  const label1 = new Label(1, "Happy", "Happy test", "emotion");
  const label2 = new Label(2, "Sad", "Sad test", "emotion");
  const labels = [label1, label2];
  const labelling = new Labelling(userId, username, labels);

  // Check labelling creation
  it('Should create an instance', () => {
    expect(new Labelling(userId, username, labels))
      .toBeTruthy();
  });

  // Getting userId of labelling
  it('Should get the user id of a labelling an instance', () => {
    expect(labelling.getUserId())
      .toBe(userId);
  });

  // Getting username of labelling
  it('Should get the username of a labelling an instance', () => {
    expect(labelling.getUsername())
      .toBe(username);
  });

  // Setting the username
  it("should set the username", () => {
    // Create instances
    const labelling2 = new Labelling(2, username, labels);
    const newUsername = "New Username";
    // Set name
    labelling2.setUsername(newUsername)
    // Check
    expect(labelling2.getUsername())
      .toBe(newUsername)
  })

  // Setting a bad username
  it('throw error for bad label name', () => {
    // Create instances
    const labelling2 = new Labelling(2, username, labels);
    const newUsername = "";
    // catch wrong name
    try {
      labelling2.setUsername(newUsername);
    } catch (error) { }
  });

  // Getting labels of labelling
  it('Should get the labels of a labelling an instance', () => {
    expect(labelling.getLabels())
      .toBe(labels);
  });

  // Getting the number of labels of labelling
  it('Should get the number of labels of a labelling an instance', () => {
    expect(labelling.getNumberOfLabels())
      .toBe(2);
  });

});