/**
 * @author B. Henkemans
 */
import { throws } from "assert";
import { Label } from "./label";

export class LabelType {
    private labelTypeName: string;
    private labelTypeDescription: string;
    private labels: Array<Label>

    /**
     * Constructor of a label type
     * @param labelTypeName 
     * @param labelTypeDescription 
     * @param labels 
     * @pre labelTypeName.length > 0
     * @pre labelTypeDescription.length > 0
     * @throws {Error} if labelTypeName.length <= 0
     * @throws {Error} if labelTypeDescription.length <= 0 
     */
    constructor(labelTypeName:string, labelTypeDescription:string, labels: Array<Label>) {
        if (labelTypeName.length <= 0) {
            throw new Error("The labelTypeName should not be of length 0 as an argument in the constructor");
        }
        if (labelTypeDescription.length <= 0) {
            throw new Error("The labelTypeDescription should not be of length 0 as an argument in the constructor");
        }
        this.labelTypeName = labelTypeName;
        this.labelTypeDescription = labelTypeDescription;
        this.labels = labels;
    }

    /**
     * Returns name of the label type
     * @returns this.labelTypeName
     */
    getLabelTypeName ():string {
        return this.labelTypeName;
    }

    /**
     * 
     * @param labelTypeName 
     */
    setLabelTypeName (labelTypeName: string): void {
        this.labelTypeName = labelTypeName;
    }

    getLabelTypeDescription ():string {
        return this.labelTypeDescription;
    }

    setLabelTypeDescription (labelTypeDescription: string): void {
        this.labelTypeDescription = labelTypeDescription;
    }

    getLabels (): Array<Label> {
        return this.labels;
    }

    /**
     * I should probably check if we are adding a unique label.
     * @param label 
     */
    addLabel (label: Label): void {
        this.labels.push(label);
    }

    /**
     * Removes label with certain ID from labelType.
     * @param ID 
     * @post ID\in labels
     * @throws {Error} if ID\not\in labels
     * @post (labels.old) === labels.push(removedLabel)
     */
    removeLabel (ID: string): void {
        for (var i: number = 0; i < this.labels.length; i++) {
            if (this.labels[i].getLabelID() === ID) {
                this.labels.splice(i, 1);
                return;
            }
        }

        throw new Error ("Label ID does not exist.");
    }
}
