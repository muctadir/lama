// Veerle Furst

import { StringArtifact } from './stringartifact';

describe('Artifact', () => {
  // Initialization variables
  const id = 1;
  const identifier = "X3Y8O";
  const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent iaculis auctor vestibulum.";
  const artifact = new StringArtifact(id, identifier, data);

  // Check artifact creation
  it('Should create an instance', () => {
    expect(new StringArtifact(id, identifier, data))
      .toBeTruthy();
  });

  // Getting of id
  it("Should get the id of the artifact", () => {
    expect(artifact.getId())
      .toBe(id)
  })

  // Setting of id
  it("Should set the id of the artifact", () => {
    // Create instances
    const artifact2 = new StringArtifact(id, identifier, data);
    const newId = 2;
    // Set id
    artifact2.setId(newId)
    // Check
    expect(artifact2.getId())
      .toBe(newId)
  })

  // Getting of identifier
  it("Should get the identifier of the artifact", () => {
    expect(artifact.getIdentifier())
      .toBe(identifier)
  })

  // Setting of identifier
  it("Should set the identifier of the artifact", () => {
    // Create instances
    const artifact2 = new StringArtifact(id, identifier, data);
    const newIdentifier = "3RT5Y";
    // Check Identifier
    artifact2.setIdentifier(newIdentifier)
    // Check
    expect(artifact2.getIdentifier())
      .toBe(newIdentifier)
  })

  // Getting of data
  it("Should get the data of the artifact", () => {
    expect(artifact.getData())
      .toBe(data)
  })

  // Setting of data
  it("Should set the data of the artifact", () => {
    // Create instances
    const artifact2 = new StringArtifact(id, identifier, data);
    const newData = "new Data";
    // Check Identifier
    artifact2.setData(newData)
    // Check
    expect(artifact2.getData())
      .toBe(newData)
  })

  // Setting of bad data
  it("Should set the data of the artifact", () => {
    // Create instances
    const artifact2 = new StringArtifact(id, identifier, data);
    const newData = "";
    //bad data try
    try {
      artifact2.setData(newData)
    } catch (error) { }
  })

  // Setting and getting of completed status
  it("Should set and get the completed of the artifact", () => {
    // Create instances
    const artifact2 = new StringArtifact(id, identifier, data);
    const completed = true;
    // Set completed
    artifact2.setCompleted(completed)
    // Check
    expect(artifact2.getCompleted())
      .toBe(completed)
  })


  // Setting and getting of start
  it("Should set and get the start of the artifact", () => {
    const start = 34;
    artifact.setStart(start)
    expect(artifact.getStart())
      .toBe(start)
  })

  // Setting and getting of end
  it("Should set and get the end of the artifact", () => {
    const end = 86;
    artifact.setEnd(end)
    expect(artifact.getEnd())
      .toBe(end)
  })

  // Setting and getting of parent id
  it("Should set and get the parent id of the artifact", () => {
    const parentId = 3;
    artifact.setParentId(parentId)
    expect(artifact.getParentId())
      .toBe(parentId)
  })

  // Setting and getting of child ids
  it("Should set and get the child ids of the artifact", () => {
    const childIds = [1, 2, 3];
    artifact.setChildIds(childIds)
    expect(artifact.getChildIds())
      .toBe(childIds)
  })

  // Getting the number of child ids
  it("Should get the number of child ids of the artifact", () => {
    const childIds = [1, 2, 3];
    artifact.setChildIds(childIds)
    expect(artifact.getNumberOfChildIds())
      .toBe(3)
  })

  // Setting and getting of highlighted piece of artifact
  it("Should set and get the highlighting of the artifact", () => {
    const highlighting = { "userId": 3, "start": 40, "end": 60 };
    artifact.setHighlighted(highlighting)
    expect(artifact.getHighlighted())
      .toBe(highlighting)
  })

});
