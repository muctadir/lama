/**
 * @author B. Henkemans
 */
export class Label {
    private labelID: string;
    private labelName: string;
    private labelDescription: string;
    private nArtifact: number;
    private deleted: boolean;

    /**
     * Constructor of a label
     * @param labelID 
     * @param labelDescription 
     * @param nArtifact 
     * @param deleted 
     * @pre labelID.length > 0
     * @pre labelDescription.length > 0
     * @throws {Error} if labelID.length <= 0
     * @throws {Error} if labelDescription.length <= 0
     * @post this.labelID == labelID && this.labelDescription == labelDescription 
     *       && this.nArtifact == nArtifact && this.deleted == deleted
     */
    constructor(labelID: string, labelName: string, labelDescription: string, nArtifact: number, deleted: boolean) {
        if (labelID.length <= 0){
            throw new Error("The labelID should not be of length 0 as an argument in the constructor");
        }
        if(labelName.length <= 0) {
            throw new Error("The labelName should not be of length 0 as an argument in the constructor");
        }
        if (labelDescription.length <= 0) {
            throw new Error("The labelDescription should not be of length 0 as an argument in the constructor");
        }
        this.labelID = labelID;
        this.labelName = labelName;
        this.labelDescription = labelDescription;
        this.nArtifact = nArtifact;
        this.deleted = deleted;
    }

    /**
     * Returns labelID
     * @returns this.labelID
     */
    getLabelID(): string {
        return this.labelID;
    }

    /**
     * Sets labelID
     * @param labelID 
     * @post labelID.length > 0
     * @throws {Error} if labelID.length <= 0 
     * @post this.labelID == labelID
     */
    setLabelID(labelID: string): void {
        if (labelID.length <= 0){
            throw new Error("The labelID should not be of length 0 as an argument in setLabelID()");
        }
        this.labelID = labelID;
    }

    /**
     * Returns labelName
     * @returns this.labelName
     */
    getLabelName(): string {
        return this.labelName;
    }

    /**
     * Sets labelName
     * @param labelName: string 
     * @post labelName.length > 0
     * @throws {Error} if labelName.length <= 0 
     * @post this.labelName == labelName
     */
    setLabelName(labelName: string): void {
        if (labelName.length <= 0){
            throw new Error("The labelName should not be of length 0 as an argument in setLabelID()");
        }
        this.labelName = labelName;
    }
    /**
     * returns labelDescription
     * @returns this.labelDescription
     */
    getLabelDescription(): string {
        return this.labelDescription;
    }

    /**
     * sets labelDescription
     * @param labelDescription 
     * @post labelDescription.length > 0
     * @throws {Error} if labelDescription.length <= 0 
     * @post this.labelDescription == labelDescription
     */
    setLabelDescription(labelDescription: string): void {
        if (labelDescription.length <= 0) {
            throw new Error("The labelDescription should not be of length 0 as an argument in setLabelDescription()");
        }
        this.setLabelDescription(labelDescription);
    }

    /**
     * returns this.deleted
     * @returns this.nArtifact
     */
    getNArtifact(): number {
        return this.nArtifact;
    }

    /**
     * sets nArtifacts
     * @param nArtifact 
     * @post this.nArtifact == nArtifact
     */
    setNArtifact(nArtifact: number): void {
        this.nArtifact = nArtifact
    }

    /**
     * returns this.deleted
     * @returns this.delted
     */
    getDeleted(): boolean {
        return this.deleted;
    }
    
    /**
     * sets deleted
     * @param deleted 
     * @post this.deleted = deleted
     */
    setDeleted(deleted: boolean): void {
        this.deleted = deleted;
    }
}
