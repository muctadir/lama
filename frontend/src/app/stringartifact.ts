import { Artifact } from "./artifact";

export class StringArtifact extends Artifact {
    data: string;

    /**
     * Constructor of the artifact
     * @param identifier 
     * @param data 
     * @param completed 
     */
    constructor(identifier: string, data:string, completed: boolean) {
        super(identifier, completed);
        this.data = data;
    }

    /**
     * Returns the artifact data
     * @returns this.data
     */
    getData(): string {
        return this.data;
    }

    /**
     * Sets the artifact data
     * @param data 
     */
    setData(data: string) {
        this.data = data;
    }
}
