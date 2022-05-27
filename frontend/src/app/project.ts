// Veerle Furst

// Project class 
export interface Project {
    id: number;
    name: string;
    description: string;
    numberOfUsers: number;
    numberOfArtifacts: number;
    numberOfCLArtifacts: number; //completely labelled artifacts
    frozen: boolean;
    admin: boolean;
    criteria: number;
}