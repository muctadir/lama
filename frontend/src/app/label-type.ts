/**
 * @author B. Henkemans
 * @author Veerle Furst
 */

 import { Label } from "./label";

 export class LabelType {
     // Id of label type
     private id: number;
     // Name of label type
     private name: string;
     // Labels of label type
     private labels: Array<Label>
 
     /**
      * Constructor of a label type
      * @param id
      * @param name 
      * @param labels 
      */
     constructor(id:number, name:string, labels: Array<Label>) {
         this.name = name;
         this.id = id;
         this.labels = labels;
     }
 
     /**
      * Returns id of the label type
      * @returns this.id
      */
      getId():number {
         return this.id;
     }
     /**
      * Sets id of label type
      * @param id 
      */
     setId(id: number): void {
         this.id = id;
     }
 
     /**
      * Returns name of the label type
      * @returns this.labelTypeName
      */
     getName ():string {
         return this.name;
     }
     /**
      * Sets name of the label type
      * @param name 
      */
     setName (name: string): void {
         this.name = name;
     }
 
     /**
      * Returns labels of the label type
      * @returns this.labels
      */
     getLabels(): Array<Label> {
         return this.labels;
     }
     /**
      * Sets labels of the label type
      * @params labels
      */
     setLabels(labels: Array<Label>): void {
         this.labels = labels;
     }    
     /**
      * I should probably check if we are adding a unique label.
      * @params label 
      */
     getNumberOfLabels(): number {
         return this.labels.length;
     }
     /**
      * I should probably check if we are adding a unique label.
      * @params label 
      */
     addLabel(label: Label): void {
         this.labels.push(label);
     }
     /**
      * Removes label with certain Id from labelType.
      * @param Id 
      */
     removeLabel(Id: number): void {
         for (var i: number = 0; i < this.labels.length; i++) {
             if (this.labels[i].getId() === Id) {
                 this.labels.splice(i, 1);
                 return;
             }
         }
         throw new Error ("Label ID does not exist.");
     }
 }
 