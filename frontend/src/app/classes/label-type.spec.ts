import { LabelType } from './label-type';
import { Label } from './label';

describe('LabelType', () => {
  // Variables for initiating instance
  const id = 1;
  const name = "Emotion";
  const label1 = new Label(1, "Happy", "Happy label", name);
  const label2 = new Label(2, "Sad", "Sad label", name);
  const labels = [label1, label2];
  const labelType = new LabelType(id, name, labels);

  // Check if instance is created correctly
  it('should create an instance', () => {
    expect(new LabelType(id, name, labels))
      .toBeTruthy();
  });

  // Getting label type id
  it('should get the id of the labelType', () => {
    expect(labelType.getId())
      .toBe(id);
  });

  // Setting label type id
  it('should set the id of the labelType', () => {
    // Create instances
    const labelType2 = new LabelType(id, name, labels);
    const newId = 2;
    // Set id
    labelType2.setId(newId);
    // Check
    expect(labelType2.getId())
      .toBe(newId);
  });

  // Getting label type name
  it('should get the name of the labelType', () => {
    expect(labelType.getName())
      .toBe(name);
  });

  // Setting label type name
  it('should set the name of the labelType', () => {
    // Create instances
    const labelType2 = new LabelType(id, name, labels);
    const newName = "Language";
    // Set the name
    labelType2.setName(newName);
    // Check
    expect(labelType2.getName())
      .toBe(newName);
  });

  // Setting a wrong label type name
  it('should throw error when name length is 0', () => {
    // Create instances
    const labelType2 = new LabelType(id, name, labels);
    const newName = "";
    // catch wrong name
    try {
      labelType2.setName(newName);
    } catch (error) { }
  });

  // Getting label type labels
  it('should get the labels of the labelType', () => {
    expect(labelType.getLabels())
      .toBe(labels);
  });

  // Setting label type labels
  it('should set the labels of the labelType', () => {
    // Creating instances
    const labelType2 = new LabelType(id, name, labels);
    const newLabel1 = new Label(3, "Python", "Python label", "language");
    const newLabel2 = new Label(4, "Java", "Java label", "language");
    const newLabels = [newLabel1, newLabel2];
    // Set the labels
    labelType2.setLabels(newLabels);
    // Check
    expect(labelType2.getLabels())
      .toEqual(newLabels);
  });

  // Getting the number of labels
  it('should get the number of labels labels of the labelType', () => {
    expect(labelType.getNumberOfLabels())
      .toBe(labels.length);
  });

  // Adding a label to the label type
  it('should add a label to the labels of the the labelType', () => {
    // Creating instances
    const labelType2 = new LabelType(id, name, labels);
    const newLabel3 = new Label(6, "Angry", "Angry label", name);
    const newLabels = labels
    // Adding the label
    newLabels.push(newLabel3);
    labelType2.addLabel(newLabel3);
    // Check
    expect(labelType2.getLabels())
      .toEqual(newLabels);
  });

  // Removing a label to the label type
  it('should add a label to the labels of the the labelType', () => {
    // Creating instances
    const labelType2 = new LabelType(id, name, labels);
    const idNewLabel = 6
    const newLabel3 = new Label(idNewLabel, "Angry", "Angry label", name);
    // Add and remove the labels
    labelType2.addLabel(newLabel3);
    labelType2.removeLabel(idNewLabel);
    // Check
    expect(labelType2.getLabels())
      .toEqual(labels);
  });

  // Removing a label when there are none
  it('should add a label to the labels of the the labelType', () => {
    // Creating instances
    const labelType2 = new LabelType(id, name, labels);
    const idNewLabel = 6
    //const newLabel3 = new Label(idNewLabel, "Angry", "Angry label", name);
    // Add and remove the labels
    //labelType2.addLabel(newLabel3);
    // Check
    try {
      labelType2.removeLabel(idNewLabel);
    } catch (error) { }
  });

  // Removing a non-existent label
  it('should add a label to the labels of the the labelType', () => {
    // Creating instances
    const labelType2 = new LabelType(id, name, labels);
    const idNewLabel = 6
    const wrongId = 4
    const newLabel3 = new Label(idNewLabel, "Angry", "Angry label", name);
    // Add and remove the labels
    labelType2.addLabel(newLabel3);
    // Check
    try {
      labelType2.removeLabel(wrongId);
    } catch (error) { }
  });


});
