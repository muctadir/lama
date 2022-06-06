/**
 * @author T. Bradley
 */

import { Label } from './label';
import { User } from './user';
import { StringArtifact } from './stringartifact';
import { Theme } from './theme';

describe('Label', () => {
  // Variables for initialisation
  const id = 1
  const name = "Label 1"
  const desc = "Label Description"
  const type = "Label Type"
  const label = new Label(id, name, desc, type)

  // Label creation 
  it('should create an instance', () => {
    expect(new Label(id, name, desc, type)).toBeTruthy();
  });

  // Getting the id
  it("should get the id", () => {
    expect(label.getId())
      .toBe(id)
  })

  // Setting the id
  it("should set the id", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const newId = 2;
    // Set id
    label2.setId(newId)
    // Check
    expect(label2.getId())
      .toBe(newId)
  })

  // Getting the name
  it("should get the name", () => {
    expect(label.getName())
      .toBe(name)
  })

  // Setting the name
  it("should set the name", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const newName = "New Theme Name";
    // Set name
    label2.setName(newName)
    // Check
    expect(label2.getName())
      .toBe(newName)
  })

  // Setting a bad label name
  it('throw error for bad label name', () => {
    // Create instances
    const label2 = new Label(id, name, desc, type);
    const newName = "";
    // catch wrong name
    try {
      label2.setName(newName);
    } catch (error) { }
  });

  // Getting the description
  it("should get the description", () => {
    expect(label.getDesc())
      .toBe(desc)
  })

  // Setting the description
  it("should set the description", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const newDesc = "New Theme Description";
    // Set description
    label2.setDesc(newDesc)
    // Check
    expect(label2.getDesc())
      .toBe(newDesc)
  })

  // Setting a bad label description
  it('throw error for bad label description', () => {
    // Create instances
    const label2 = new Label(id, name, desc, type);
    const newDesc = "";
    // catch wrong name
    try {
      label2.setDesc(newDesc);
    } catch (error) { }
  });

  // Getting the type
  it("should get the type", () => {
    expect(label.getType())
      .toBe(type)
  })

  // Setting the type
  it("should set the type", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const newType = "New Label Type";
    // Set type
    label2.setType(newType)
    // Check
    expect(label2.getType())
      .toBe(newType)
  })

  // Setting a bad label type
  it('throw error for bad label description', () => {
    // Create instances
    const label2 = new Label(id, name, desc, type);
    const newType = "";
    // catch wrong name
    try {
      label2.setType(newType);
    } catch (error) { }
  });

  // Setting and getting the parent labels
  it("should set and get parent labels", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const parent1 = new Label(3, "label1", "labelDesc1", "type");
    const parent2 = new Label(4, "label2", "labelDesc2", "type");
    // Set parents
    label2.setParents([parent1, parent2]);
    // Check
    expect(label2.getParents())
      .toEqual([parent1, parent2])
  })

  // Getting the number of parent labels
  it("Should get the number of parent labels", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const parent1 = new Label(3, "label1", "labelDesc1", "type");
    const parent2 = new Label(4, "label2", "labelDesc2", "type");
    const parents = [parent1, parent2];
    // Set parents
    label2.setParents(parents);
    // Check
    expect(label2.getNumberOfParents())
      .toBe(parents.length)
  })

  // Setting and getting the child labels
  it("should set and get the child labels", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const child1 = new Label(3, "label1", "labelDesc1", "type");
    const child2 = new Label(4, "label2", "labelDesc2", "type");
    // Set childs
    label2.setChilds([child1, child2]);
    // Check
    expect(label2.getChilds())
      .toEqual([child1, child2])
  })

  // Getting the number of child labels
  it("Should get the number of child labels", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const child1 = new Label(3, "label1", "labelDesc1", "type");
    const child2 = new Label(4, "label2", "labelDesc2", "type");
    const childs = [child1, child2];
    // Set childs
    label2.setChilds(childs);
    // Check
    expect(label2.getNumberOfChilds())
      .toBe(childs.length)
  })

  // Setting and getting the label artifacts
  it("should set and get the label artifacts", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const artifact1 = new StringArtifact(1, "artifact1", "artifactData1");
    const artifact2 = new StringArtifact(2, "artifact2", "artifactData2");
    // Set artifacts
    label2.setArtifacts([artifact1, artifact2]);
    // Check
    expect(label2.getArtifacts())
      .toEqual([artifact1, artifact2])
  })

  // Getting the number of label artifacts
  it("Should get the number of artifacts", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const artifact1 = new StringArtifact(1, "artifact1", "artifactData1");
    const artifact2 = new StringArtifact(2, "artifact2", "artifactData2");
    const artifacts = [artifact1, artifact2];
    // Set artifacts
    label2.setArtifacts(artifacts);
    // Check
    expect(label2.getNumberOfArtifacts())
      .toBe(artifacts.length)
  })

  // Setting and getting the label users
  it("should set and get the label users", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const user1 = new User(1, "user1");
    const user2 = new User(2, "user2");
    // Set users
    label2.setUsers([user1, user2]);
    // Check
    expect(label2.getUsers())
      .toEqual([user1, user2])
  })

  // Getting the number of label users
  it("Should get the number of users", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const user1 = new User(1, "user1");
    const user2 = new User(2, "user2");
    const users = [user1, user2];
    // Set users
    label2.setUsers(users);
    // Check
    expect(label2.getNumberOfUsers())
      .toBe(users.length)
  })

  // Setting and getting label's themes
  it("should set and get the label's themes", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const theme1 = new Theme(3, "theme1", "themeDesc1");
    const theme2 = new Theme(4, "theme2", "themeDesc2");
    // Set themes
    label2.setThemes([theme1, theme2]);
    // Check
    expect(label2.getThemes())
      .toEqual([theme1, theme2])
  })

  // Getting the number of theme labels
  it("Should get the number of theme labels", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const theme1 = new Theme(3, "theme1", "themeDesc1");
    const theme2 = new Theme(4, "theme2", "themeDesc2");
    const themes = [theme1, theme2];
    // Set themes
    label2.setThemes(themes);
    // Check
    expect(label2.getNumberOfThemes())
      .toBe(themes.length)
  })

  // Getting and setting the deletion status
  it("should get the deletion status", () => {
    // Create instances
    const label2 = new Label(id, name, desc, type)
    const status = false;
    // Set deleted
    label2.setDeleted(status);
    // Check
    expect(label2.getDeleted())
      .toBe(status)
  })


});


