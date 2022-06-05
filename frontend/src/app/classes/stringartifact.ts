// Veerle Furst

import { Artifact } from "./artifact";

export class StringArtifact extends Artifact {
    // Data of the artifact
    data: string;
    // Start of the artifact split
    private start: number | undefined;
    // End of the artifact split
    private end: number | undefined;

    /**
     * Constructor of the artifact 
     * @param id 
     * @param identifier 
     * @param data
     */
    constructor(id: number, identifier: string, data: string) {
        super(id, identifier);
        this.data = data;
    }

    /**
     * Gets the artifact data
     * @returns this.data
     */
    getData(): string {
        return this.data;
    }

    /**
     * Sets the artifact data
     * @param data 
     */
    setData(data: string): void {
        this.data = data;
    }

    /**
     * gets the start
     * @return this.start 
     */
    getStart(): number | undefined {
        return this.start;
    }

    /**
     * sets the start
     * @params start
     */
    setStart(start: number): void {
        this.start = start;
    }

    /**
     * gets the end
     * @return this.end 
     */
    getEnd(): number | undefined {
        return this.end;
    }
    
    /**
     * sets the end
     * @params end
     */
    setEnd(end: number): void {
        this.end = end;
    }
}
