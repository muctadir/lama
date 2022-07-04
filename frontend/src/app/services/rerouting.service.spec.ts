import { TestBed } from '@angular/core/testing';

import { ReroutingService } from './rerouting.service';

describe('ReroutingService', () => {
  let service: ReroutingService;

  // Initializes the Rerouting service
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReroutingService);
  });

  // Checks whether the service is created correctly
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Checks whether the pid is obtained correctly in regular input
  it('should obtain pid correctly in regular input', () => {
    let result = service.getProjectID("/something/8/somethingelse");
    expect(result).toBe("8");
  });

  // Checks whether the pid is obtained correctly in longer input
  it('should obtain pid in longer input', () => {
    let result = service.getProjectID("/something/7/somethingelse/anotherarg");
    expect(result).toBe("7");
  });

  // Checks whether it behaves when first / is missing
  it('should get the pid when first / is missing', () => {
    let result = service.getProjectID("something/7/somethingelse");
    expect(result).toBe("7");
  });

  it('should get the label id from the url', () => {
    let result = service.getLabelID("/something/7/somethingelse/5");
    expect(result).toBe("5");
  });

  it('should get the artifact id from the url', () => {
    let result = service.getArtifactID("/project/8/single-artifact/22");
    expect(result).toBe("22");
  });

  it('should get the conflict id from the url', () => {
    let result = service.getArtifactConflict("/project/8/single-artifact/22/3/6");
    expect(result).toEqual(["22", "3", "6"]);
  });

  it('should get the theme id from the url', () => {
    let result = service.getThemeID("/project/1/single-theme/69");
    expect(result).toBe("69");
  });

  it('should return that we are on the random labelling page', () => {
    let result = service.checkLabellingId("/project/1/labelling-page");
    expect(result).toBeFalsy();
  });

  it('should return that we are on the random labelling page', () => {
    let result = service.checkLabellingId("/project/1/labelling-page/8");
    expect(result).toBeTruthy();
  });
});
