// Veerle Furst

// Project class 

// A project object is created in steps
// 1. get all projects the user can see and save the id, name, description, and frozen
// 2. get whether the user is admin or not and save this boolean
// 3. get all artifacts per project and save this number
// 4. get all completely labelled artifacts per project and save this number
// 5. get all users within a project and save this number

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
        frozen: boolean,
    ) {
        this.projectID = projectID;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.numberOfUsers = 0; // hardcoded to be changed later
        this.numberOfArtifacts = 0; // hardcoded to be changed later
        this.numberOfCLArtifacts = 0; // hardcoded to be changed later
        this.frozen = frozen;
        this.admin = false; // hardcoded to be changed later
    }

    // Setting admin
    setAdminProject(admin: boolean){
        this.admin = admin;
    } 

    // Setting artifacts per project
    setArtifactsProject(numberOfArtifacts: number){
        this.numberOfArtifacts = numberOfArtifacts;
    } 

    // Setting number of completely labelled artifacts per project
    setnumberOfCLArtifacts(numberOfCLArtifacts: number){
        this.numberOfCLArtifacts = numberOfCLArtifacts;
    } 

    // Setting number of users per project
    setnumberOfUsers(numberOfUsers: number){
        this.numberOfUsers = numberOfUsers;
    } 
  }