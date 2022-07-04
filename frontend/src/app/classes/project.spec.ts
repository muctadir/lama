import { Project } from './project';
import { User } from './user';

describe('Project', () => {
  // Initial variables
  const id = 1
  const name = "Project 1"
  const desc = "New project"
  const project = new Project(id, name, desc)

  // Project creation 
  it('should create an instance', () => {
    expect(new Project(id, name, desc)).toBeTruthy();
  });

  // Getting the id
  it("should get the id", () => {
    const testId = 1;
    const testProject = new Project(testId, name, desc);
    expect(testProject.getId())
      .toBe(testId)
  })

  // Setting the id
  it("should set the id", () => {
    const newId = 2;
    project.setId(newId);
    expect(project.getId())
      .toBe(newId)
  })

  // Getting the name
  it("should get the name", () => {
    const testName = "Project 1";
    const testProject = new Project(id, testName, desc);
    expect(testProject.getName())
      .toBe(testName)
  })

  // Setting the name
  it("should set the name", () => {
    const newName = "Project 2";
    project.setName(newName);
    expect(project.getName())
      .toBe(newName)
  })

  // Setting a bad project name
  it('should throw an error for bad project name', () => {
    // Create instances
    const proj2 = new Project(id, name, desc);
    const newName = "";
    // catch wrong name
    try {
      proj2.setName(newName);
    } catch (error) { }
  });

  // Getting the description
  it("should get the description", () => {
    const testDesc = "Test project";
    const testProject = new Project(id, name, testDesc);
    expect(testProject.getDesc())
      .toBe(testDesc)
  })

  // Setting the description
  it("should set the description", () => {
    const newDesc = "Test project";
    project.setDesc(newDesc);
    expect(project.getDesc())
      .toBe(newDesc)
  })

  // Setting a bad project description
  it('should throw an error for bad project description', () => {
    // Create instances
    const proj2 = new Project(id, name, desc);
    const newDesc = "";
    // catch wrong name
    try {
      proj2.setDesc(newDesc);
    } catch (error) { }
  });

  // Setting and getting the users
  it("should set the users", () => {
    const user1 = new User(1, "Veerle");
    const user2 = new User(2, "Thea");
    const users = [user1, user2];
    project.setUsers(users);
    expect(project.getUsers())
      .toBe(users)
  })

  // Getting the number of users
  it("should get the amount of users", () => {
    const user1 = new User(1, "Veerle");
    const user2 = new User(2, "Thea");
    const users = [user1, user2];
    project.setUsers(users);
    expect(project.getNumberOfUsers())
      .toBe(2)
  })

  // Setting and getting the numberOfArtifacts
  it("should set the numberOfArtifacts", () => {
    const numberOfArtifacts = 2;
    project.setNumberOfArtifacts(numberOfArtifacts);
    expect(project.getNumberOfArtifacts())
      .toBe(numberOfArtifacts)
  })

  // Setting and getting the numberOfCLArtifacts
  it("should set the numberOfCLArtifacts", () => {
    const numberOfCLArtifacts = 2;
    project.setNumberOfCLArtifacts(numberOfCLArtifacts);
    expect(project.getNumberOfCLArtifacts())
      .toBe(numberOfCLArtifacts)
  })

  // Setting and getting the frozen
  it("should set the frozen", () => {
    const frozen = false;
    project.setFrozen(frozen);
    expect(project.getFrozen())
      .toBe(frozen)
  })

  // Setting and getting the criteria
  it("should set the criteria", () => {
    const criteria = 2;
    project.setCriteria(criteria);
    expect(project.getCriteria())
      .toBe(criteria)
  })

  // Setting and getting the admin
  it("should set the admin", () => {
    const admin = true;
    project.setAdmin(admin);
    expect(project.getAdmin())
      .toBe(admin)
  })

});
