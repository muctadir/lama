import { TestBed } from '@angular/core/testing';
import { Project } from 'app/classes/project';
import { User } from 'app/classes/user';
import { StatsDataService } from './stats-data.service';

describe('StatsDataService', () => {
  /* Objects to be used in testing */
  // Project id
  const p_id = 5;
  // Empty array of users
  let users: Array<User> = []
  // Data from a single project
  let project_data = {
    "project": {
      "id": 5,
      "name": "Project",
      "description": "Tester project"
    },
    "projectNrArtifacts": 10,
    "projectNrCLArtifacts": 3,
    "projectUsers": users,
    "conflicts": 10,
    "labels": ["Label1", "Label2"]
  };
  // Project made with data from project_data
  let project = new Project(
    project_data["project"]["id"],
    project_data["project"]["name"],
    project_data["project"]["description"]
  );
  project.setNumberOfArtifacts(project_data["projectNrArtifacts"]);
  project.setNumberOfCLArtifacts(project_data["projectNrCLArtifacts"])
  project.setUsers(project_data["projectUsers"])

  let service: StatsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    service = TestBed.inject(StatsDataService);
  });

  // Checks if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Checks if getProject throws an error when necessary
  it('should throw an error for unsuitable p_id for getProject', async () => {
    await expectAsync(service.getProject(0))
      .toBeRejectedWith(new Error("p_id cannot be less than 1"));
  });

  // Checks if getProject works correctly
  it('should return the correct data and call the request handler for getProject', async () => {
    // Return project_data when statsDataService.getProject(p_id) is called
    spyOn(service['requestHandler'], 'get').and
      .returnValue(Promise.resolve(project_data));

    // Call the getProject function
    let data = await service.getProject(p_id);

    // Check that requestHandler.get 
    // was called with the right parameters
    expect(service['requestHandler'].get)
      .toHaveBeenCalledWith('/project/singleProject', { 'p_id': p_id }, true);
    // Check that the right data is returned
    expect(data).toEqual({
      'project_data': project,
      'conflicts': project_data["conflicts"],
      'labels': project_data["labels"]
    });
  });

  // Checks if getUserStats throws an error when necessary
  it('should throw an error for unsuitable p_id for getUserStats', async () => {
    await expectAsync(service.getUserStats(0))
      .toBeRejectedWith(new Error("p_id cannot be less than 1"));
  });

  // Checks if getUserStats works correctly
  it('should return the correct data and call the request handler for getUserStats', async () => {
    // Return project_data when statsDataService.getProject(p_id) is called
    spyOn(service['requestHandler'], 'get').and
      .returnValue(Promise.resolve(['array', 'of', 'data']));

    // Call the getProject function
    let data = await service.getUserStats(p_id);

    // Check that requestHandler.get 
    // was called with the right parameters
    expect(service['requestHandler'].get)
      .toHaveBeenCalledWith('/project/projectStats', { 'p_id': p_id }, true);
    // Check that the right data is returned
    expect(data).toEqual(['array', 'of', 'data']);
  });
})
