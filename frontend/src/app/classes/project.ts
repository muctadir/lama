// Veerle Furst
import { User } from "./user";

// Project class 
export class Project {
    // Id of the project
    private id: number;
    // Name of the project
    private name: string;
    // Description of the project
    private description: string;
    // Users of the project
    private users: Array<User> | undefined;
    // Number of artifacts in the project
    private numberOfArtifacts: number | undefined;
    // Number of completely labelled artifacts in the project
    private numberOfCLArtifacts: number | undefined;
    // Frozen of the project
    private frozen: boolean | undefined;
    // Criteria of the project
    private criteria: number | undefined;
    // If user is admin of the project
    private admin: boolean | undefined;

    /**
     * Constructor sets id, name, and description
     * @param id 
     * @param name
     * @param desc 
     */
    constructor(id: number, name: string, desc: string) {
        this.id = id;
        this.name = name;
        this.description = desc;
    }

    /**
     * Function returns project id
     * @returns this.id
     */
    getId(): number {
        return this.id;
    }

    /**
     * Function sets project id
     * @params id
     */
    setId(id: number): void {
        this.id = id;
    }

    /**
     * Function returns project name
     * @returns this.name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Function sets project name
     * @params name
     */
    setName(name: string): void {
        if (name == undefined || typeof name != "string" || name.length <= 0) {
            throw new Error("The project name should not be of length 0 as an argument in setName()");
        }
        this.name = name;
    }

    /**
     * Function returns project description
     * @returns this.description
     */
    getDesc(): string {
        return this.description;
    }

    /**
     * Function sets project description
     * @params desc
     */
    setDesc(desc: string): void {
        if (desc == undefined || typeof desc != "string" || desc.length <= 0) {
            throw new Error("The project description should not be of length 0 as an argument in setDesc()");
        }
        this.description = desc;
    }

    /**
     * Function returns project users
     * @returns this.users
     */
    getUsers(): Array<User> | undefined {
        return this.users;
    }

    /**
     * Function sets project users
     * @params users
     */
    setUsers(users: Array<User>): void {
        this.users = users;
    }

    /**
     * Function get the number of users in the project
     * @return this.users.length
     */
    getNumberOfUsers(): number | undefined {
        let usersVar = this.users;
        // Make sure the users are defined when calling
        if (usersVar != undefined) {
            return usersVar.length;
        } else {
            return 0;
        }
    }

    /**
     * Function gets project number of artifacts
     * @returns numberOfArtifacts
     */
    getNumberOfArtifacts(): number {
        const numberOfArtifacts = this.numberOfArtifacts;
        if (numberOfArtifacts != undefined) {
            return numberOfArtifacts;
        } else {
            return 0;
        }
    }

    /**
     * Function sets project number of artifacts
     * @params numberOfArtifacts
     */
    setNumberOfArtifacts(numberOfArtifacts: number): void {
        this.numberOfArtifacts = numberOfArtifacts;
    }

    /**
     * Function gets project number of completely labelled artifacts
     * @returns numberOfCLArtifacts
     */
    getNumberOfCLArtifacts(): number {
        const numberOfCLArtifacts = this.numberOfCLArtifacts;
        if (numberOfCLArtifacts != undefined) {
            return numberOfCLArtifacts;
        } else {
            return 0;
        }
    }

    /**
     * Function sets project number of completely labelled artifacts
     * @params numberOfCLArtifacts
     */
    setNumberOfCLArtifacts(numberOfCLArtifacts: number): void {
        this.numberOfCLArtifacts = numberOfCLArtifacts;
    }

    /**
     * Function returns project frozen
     * @returns this.frozen
     */
    getFrozen(): boolean | undefined {
        return this.frozen;
    }

    /**
     * Function sets project frozen
     * @params frozen
     */
    setFrozen(frozen: boolean): void {
        this.frozen = frozen;
    }

    /**
     * Function returns project criteria
     * @returns this.criteria
     */
    getCriteria(): number | undefined {
        return this.criteria;
    }

    /**
     * Function sets project criteria
     * @params criteria
     */
    setCriteria(criteria: number): void {
        this.criteria = criteria;
    }

    /**
    * Function returns project admin
    * @returns this.admin
    */
    getAdmin(): boolean | undefined {
        return this.admin;
    }

    /**
     * Function sets project criteria
     * @params criteria
     */
    setAdmin(admin: boolean): void {
        this.admin = admin;
    }
}