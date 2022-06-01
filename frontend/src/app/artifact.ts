export abstract class Artifact {
    identifier: string;
    abstract data: any;
    completed: boolean;
    labeledBy: Array<string>;

    /**
     * Constructor sets identifier and status
     * @pre identifier.length != 0 && identifier != null
     * @param identifier 
     * @param completed 
     * @post this.identifier == identifier && this.completed == completed
     */
    constructor(identifier: string, completed: boolean) {
        if (identifier.length == 0 || identifier == undefined) {
            throw new Error('Identifier should not be empty in constructor');
        }

        this.identifier = identifier;
        this.completed = completed;
        this.labeledBy = new Array<string>();
    }

    /**
     * returns identifier of the artifact
     * @returns this.identifier
     */
    getIdentifier(): string {
        return this.identifier;
    }

    /**
     * sets the identifier of the artifact
     * @pre identifier.length != 0 && identifier != null
     * @param identifier: string 
     */
    setIdentifier(identifier: string): void {
        if (identifier.length == 0 || identifier == undefined) {
            throw new Error('Identifier should not be set to empty.');
        }
        this.identifier = identifier;
    }

    /**
     * returns the status of the artifact
     * @returns this.completed
     */
    getCompleted(): boolean {
        return this.completed;
    }

    /**
     * sets the status of the artifact
     * @param completed 
     */
    setCompleted(completed: boolean): void {
        this.completed = completed;
    }

    getLabelers (): Array<string> {
        return this.labeledBy;
    }

    addLabeler (labeler: string): void {
        this.labeledBy.push(labeler);
    }

}
