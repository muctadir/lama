// Veerle Furst
// BartJan Henkemans

export abstract class Artifact {
    // Id of artifact 
    private id: number;
    // Identifier of the artifact
    private identifier: string;
    // Data of the artifact
    abstract data: any;
    // If the artifact if completelly labelled
    private completed: boolean | undefined;
    /** 
     * Labellings of the artifact
     * This labellings should include this information PER LABELLING
     * [username, labelname, labeltype, description, remark]
     * This is all that is needed for the artifact page
     * You can put extra/less infromation in here if needed, because its an any type array
    **/ 
    private labellings: Array<Array<any>> | undefined;
    // Parent of the artifact (split)
    private parentId: number | undefined;
    // Childern of the artifact (split)
    private childIds: Array<number> | undefined;
    // Highlight information of the artifact
    private highlighted: any;

    /**
     * Constructor sets identifier and status
     * @pre identifier.length != 0 && identifier != null
     * @param id
     * @param identifier 
     * @post this.identifier == identifier && this.completed == completed
     */
    constructor(id: number, identifier: string) {
        if (identifier.length == 0 || identifier == undefined) {
            throw new Error('Identifier should not be empty in constructor');
        }
        this.id = id;
        this.identifier = identifier;
    }

    /**
     * returns id of the artifact
     * @returns this.id
     */
    getId(): number {
        return this.id;
    }

    /**
     * sets id of the artifact
     * @params id
     */
    setId(id: number): void {
        this.id = id;
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
    getCompleted(): boolean | undefined {
        return this.completed;
    }

    /**
     * sets the status of the artifact
     * @param completed 
     */
    setCompleted(completed: boolean): void {
        this.completed = completed;
    }

    /**
     * gets the labellings
     * @return this.labelling 
     */
    getLabellings(): Array<Array<any>> | undefined {
        return this.labellings;
    }

    /**
     * sets the labellings
     * @params labellings
     */
    setLabellings(labellings: Array<Array<any>>): void {
        this.labellings = labellings;
    }

    /**
     * gets the number of labellings
     * @return this.labelling.length
     */
    getNumberOfLabellings(): number {
        const labelling = this.labellings
        // Make sure the list is not undefined
        if (labelling != undefined) {
            return labelling.length;
        } else {
            return 0;
        }
    }

    /**
     * adds a labellings to the list
     * @param newLabelling 
     */
    addLabelling(newLabelling: Array<any>): void {
        const labelling = this.labellings
        // Make sure the list in not undefined
        if (labelling != undefined) {
            labelling.push(newLabelling);
        }
    }

    /**
     * gets the parentId
     * @return this.parentId 
     */
    getParentId(): number | undefined {
        return this.parentId;
    }

    /**
     * sets the parentId
     * @params parentId
     */
    setParentId(parentId: number): void {
        this.parentId = parentId;
    }

    /**
     * gets the childIds
     * @return this.childIds 
     */
    getChildIds(): Array<number> | undefined {
        return this.childIds;
    }

    /**
     * sets the childIds
     * @params childIds
     */
    setChildIds(childIds: Array<number>): void {
        this.childIds = childIds;
    }

    /**
     * gets the number of childIds
     * @returns this.childIds.length
     */
    getNumberOfChildIds(): number {
        const childIds = this.childIds;
        // Check if list is undefined
        if (childIds != undefined) {
            return childIds.length;
        } else {
            return 0;
        }
    }

    /**
     * gets the highlighted
     * @return this.highlighted 
     */
    getHighlighted(): any | undefined {
        return this.highlighted;
    }

    /**
     * sets the highlighted
     * @params highlighted
     */
    setHighlighted(highlighted: any): void {
        this.highlighted = highlighted;
    }

}
