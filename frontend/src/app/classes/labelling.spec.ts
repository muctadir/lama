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