/**
 * @author T. Bradley
 */

import { Theme } from './theme';
import { Label } from './label'


describe('Theme', () => {
  // Variables for initialisation
  const id = 1
  const name = "Theme 1"
  const desc = "New Theme"
  const theme = new Theme(id, name, desc)


  // Theme creation 
  it('should create an instance', () => {
    expect(new Theme(id, name, desc)).toBeTruthy();
  });

  // Getting the id
  it("should get the id", () => {
    expect(theme.getId())
      .toBe(id)
  })

  // Setting the id
  it("should set the id", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const newId = 2;
    // Set id
    theme2.setId(newId)
    // Check
    expect(theme2.getId())
      .toBe(newId)
  })

  // Getting the name
  it("should get the name", () => {
    expect(theme.getName())
      .toBe(name)
  })

  // Setting the name
  it("should set the name", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const newName = "New Theme Name";
    // Set name
    theme2.setName(newName)
    // Check
    expect(theme2.getName())
      .toBe(newName)
  })

  // Getting the description
  it("should get the description", () => {
    expect(theme.getDesc())
      .toBe(desc)
  })

  // Setting the description
  it("should set the description", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const newDesc = "New Theme Description";
    // Set description
    theme2.setDesc(newDesc)
    // Check
    expect(theme2.getDesc())
      .toBe(newDesc)
  })

  // Setting and getting the parent themes
  it("should set and get parent themes", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const parent = new Theme(3, "theme1", "themeDesc1");
    // Set the parent
    theme2.setParent(parent);
    // Check
    expect(theme2.getParent())
      .toEqual(parent)
  })


  // Setting and getting the child themes
  it("should set and get the child themes", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const child1 = new Theme(3, "theme1", "themeDesc1");
    const child2 = new Theme(4, "theme2", "themeDesc2");
    // Set children
    theme2.setChildren([child1, child2]);
    // Check
    expect(theme2.getChildren())
      .toEqual([child1, child2])
  })

  // Getting the number of child themes
  it("should get the number of child themes", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const child1 = new Theme(3, "theme1", "themeDesc1");
    const child2 = new Theme(4, "theme2", "themeDesc2");
    const children = [child1, child2];
    // Set children
    theme2.setChildren(children);
    // Check
    expect(theme2.getNumberOfChildren())
      .toBe(children.length)
  })

  // Getting the number of child themes
  it("should get the number of child themes, error case", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const children = undefined;
    // Set children
    theme2.setChildren(undefined);
    let result = theme2.getNumberOfChildren();

    // Check
    expect(result).toEqual(0);
  })

  // Setting and getting the theme labels
  it("should set and get the theme labels", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const label1 = new Label(1, "label1", "labelDesc1", "type");
    const label2 = new Label(2, "label2", "labelDesc2", "type");
    // Set labels
    theme2.setLabels([label1, label2]);
    // Check
    expect(theme2.getLabels())
      .toEqual([label1, label2])
  })

  // Getting the number of theme labels
  it("should get the number of labels", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const label1 = new Label(1, "label1", "labelDesc1", "type");
    const label2 = new Label(2, "label2", "labelDesc2", "type");
    const labels = [label1, label2];
    // Set labels
    theme2.setLabels(labels);
    // Check
    expect(theme2.getNumberOfLabels())
      .toBe(labels.length)
  })

  // Getting the number of theme labels
  it("should get the number of labels", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const numberOfLabels = 5;
    // Set number of labels
    theme2.setNumberOfLabels(numberOfLabels);
    // Check
    expect(theme2.getNumberOfLabels())
      .toBe(numberOfLabels)
  })

  // Getting and setting the deletion status
  it("should get the deletion status", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const status = true;
    // Set deleted
    theme2.setDeleted(status);
    // Check
    expect(theme2.getDeleted())
      .toBe(status)
  })

  // Getting and setting the deletion status
  it("should get the deletion status", () => {
    // Create instances
    const theme2 = new Theme(id, name, desc)
    const status = false;
    // Set deleted
    theme2.setDeleted(status);
    // Check
    expect(theme2.getDeleted())
      .toBe(status)
  })
});