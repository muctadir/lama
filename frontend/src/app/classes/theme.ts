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
    private themeParents: Array<Theme> | undefined;
    //array of child themes of the theme
    private themeChilds: Array<Theme> | undefined;
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
        if ( name == undefined || typeof name != "string" || name.length <= 0) {
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
        if ( desc == undefined || typeof desc != "string" || desc.length <= 0) {
            throw new Error("The theme description should not be of length 0 as an argument in setDesc()");
        }
        this.desc = desc;
    }

    /**
    * Function returns the parent themes
    * @returns this.themeParents
    */
    getParents(): Array<Theme> | undefined {
        return this.themeParents;
    }

    /**
    * Sets the parent themes 
    * @param themeParents 
    */
    setParents(themeParents: Array<Theme> | undefined): void {
        this.themeParents = themeParents
    }

    /**
    * Function get the number of parent themes
    * @return this.themeParents.length
    */
    getNumberOfParents(): number | undefined {
        let parentsVar = this.themeParents;
        // Make sure the parents are defined when calling
        if (parentsVar != undefined) {
            return parentsVar.length;
        } else {
            return 0;
        }
    }

    /**
    * Function returns the child themes
    * @returns this.themeChilds
    */
    getChilds(): Array<Theme> | undefined {
        return this.themeChilds;
    }

    /**
    * Sets the child themes 
    * @param themeChilds 
    */
    setChilds(themeChilds: Array<Theme> | undefined): void {
        this.themeChilds = themeChilds
    }

    /**
    * Function get the number of child themes
    * @return this.themeChilds.length
    */
    getNumberOfChilds(): number | undefined {
        let childsVar = this.themeChilds;
        // Make sure the childs are defined when calling
        if (childsVar != undefined) {
            return childsVar.length;
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
