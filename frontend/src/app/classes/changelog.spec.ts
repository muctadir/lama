import { Changelog } from './changelog';

describe('Changelog', () => {
  const name = "Change 1"
  const timestamp = "Change timestamp"
  const desc = "Change Description"
  const log = new Changelog(name, timestamp, desc)


  it('should create an instance', () => {
    expect(new Changelog("a", "b", "c")).toBeTruthy();
  });

  // Getting the name
  it("should get the name", () => {
    expect(log.getName())
      .toBe(name)
  })

  // Setting the name
  it("should set the name", () => {
    // Create instances
    const log2 = new Changelog(name, timestamp, desc)
    const newName = "New Changelog Name";
    // Set name
    log2.setName(newName)
    // Check
    expect(log2.getName())
      .toBe(newName)
  })

  // Getting the timestamp
  it("should get the timestamp", () => {
    expect(log.getTimestamp())
      .toBe(timestamp)
  })

  // Setting the timestamp
  it("should set the timestamp", () => {
    // Create instances
    const log2 = new Changelog(name, timestamp, desc)
    const newTime = "New Changelog Timestamp";
    // Set Timestamp
    log2.setTimestamp(newTime)
    // Check
    expect(log2.getTimestamp())
      .toBe(newTime)
  })

  // Getting the description
  it("should get the description", () => {
    expect(log.getDesc())
      .toBe(desc)
  })

  // Setting the description
  it("should set the description", () => {
    // Create instances
    const log2 = new Changelog(name, timestamp, desc)
    const newDesc = "New Changelog Description";
    // Set Description
    log2.setDesc(newDesc)
    // Check
    expect(log2.getDesc())
      .toBe(newDesc)
  })


});
