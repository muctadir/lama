/**
* @author B. Henkemans
* @author T. Bradley
*/

import { Label } from './label';

export class Theme {

    //ID of the theme
    private id: number;
    //name of the theme
    private name: string;
    //description of the theme
    private desc: string;
    //array of parent themes of the theme
    private themeParent: Theme | undefined;
    //array of child themes of the theme
    private themeChildren: Array<Theme> | undefined;
    //array of theme labels
    private labels: Array<Label> | undefined;
    //deletion status of the theme
    private deleted: boolean | undefined;

    /**
    * Constructor sets id, name, and description
    * @param id 
    * @param name
    * @param desc 
    */
    constructor(id: number, name: string, desc: string) {
        this.id = id;
        this.name = name;
        this.desc = desc;
    }

    /**
    * Function returns theme id
    * @returns this.id
    */
    getId(): number {
        return this.id;
    }

    /**
    * Sets the theme id
    * @param id
    */
    setId(id: number): void {
        this.id = id;
    }

    /**
    * Function returns theme name
    * @returns this.themeName
    */
    getName(): string {
        return this.name;
    }

    /**
    * Sets the theme name
    * @param themeName 
    */
    setName(name: string): void {
        if ( name == undefined || typeof name != "string" || name.length < 0) {
            throw new Error("The theme name should not be of length 0 as an argument in setName()");
        }
        this.name = name;
    }


    /**
    * Function returns the theme description
    * @returns this.desc
    */
    getDesc(): string {
        return this.desc;
    }

    /**
    * Sets the theme description
    * @param desc 
    */
    setDesc(desc: string): void {
        if ( desc == undefined || typeof desc != "string" || desc.length < 0) {
            throw new Error("The theme description should not be of length 0 as an argument in setDesc()");
        }
        this.desc = desc;
    }

    /**
    * Function returns the parent themes
    * @returns this.themeParents
    */
    getParent(): Theme | undefined {
        return this.themeParent;
    }

    /**
    * Sets the parent themes 
    * @param themeParents 
    */
    setParent(themeParent: Theme | undefined): void {
        this.themeParent = themeParent
    }

    /**
    * Function returns the child themes
    * @returns this.themeChildren
    */
    getChildren(): Array<Theme> | undefined {
        return this.themeChildren;
    }

    /**
    * Sets the child themes 
    * @param themeChildren 
    */
    setChildren(themeChildren: Array<Theme> | undefined): void {
        this.themeChildren = themeChildren
    }

    /**
    * Function get the number of child themes
    * @return this.themeChildren.length
    */
    getNumberOfChildren(): number | undefined {
        let childrenVar = this.themeChildren;
        // Make sure the children are defined when calling
        if (childrenVar != undefined) {
            return childrenVar.length;
        } else {
            return 0;
        }
    }

    /**
    * Function returns the theme labels
    * @returns this.labels
    */
    getLabels(): Array<Label> | undefined {
        return this.labels;
    }

    /**
    * Sets the theme's labels 
    * @param labels
    */
    setLabels(labels: Array<Label> | undefined): void {
        this.labels = labels
    }

    /**
    * Returns the amount of labels connected to this theme if the array has been defined.
    * @returns labels.length
    */
    getNumberOfLabels(): number {
        if (this.labels == undefined) {
            return 0;
        } else {
            return this.labels.length;
        }
    }

    /**
    * Function returns theme deletion status
    * @returns this.deleted
    */
    getDeleted(): boolean | undefined {
        return this.deleted;
    }

    /**
    * Sets the theme deletion status
    * @param deleted
    */
    setDeleted(deleted: boolean | undefined): void {
        this.deleted = deleted
    }


}
