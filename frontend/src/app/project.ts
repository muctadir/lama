// Veerle Furst

// Project class 
export class Project {
    projectID: number;
    projectName: string;
    projectDescription: string;
    numberOfUsers: number;
    numberOfArtifacts: number;
    numberOfCLArtifacts: number; //completely labelled artifacts
    frozen: boolean;
    admin: boolean;

    // Constructor to initialize project id, name, description, and if its frozen
    constructor(
        projectID: number, 
        projectName: string,
        projectDescription: string,
        numberOfUsers: number,
        numberOfArtifacts: number,
        numberOfCLArtifacts: number,
        frozen: boolean,
        admin: boolean
    ) {
        this.projectID = projectID;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.numberOfUsers = numberOfUsers; // hardcoded to be changed later
        this.numberOfArtifacts = numberOfArtifacts; // hardcoded to be changed later
        this.numberOfCLArtifacts = numberOfCLArtifacts; // hardcoded to be changed later
        this.frozen = frozen;
        this.admin = admin; // hardcoded to be changed later
    }
  }