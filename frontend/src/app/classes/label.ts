/**
 * @author B. Henkemans
 * @author T. Bradley
 */

import { StringArtifact } from './stringartifact';
import { User } from './user';
import { Theme } from './theme'

export class Label {

    //ID of the label
    private id: number;
    //name of the label
    private name: string;
    //name of the description
    private desc: string;
    //name of the label type
    private type: string;
    //array of parent labels of the label
    private labelParents: Array<Label> | undefined;
    //array of child labels of the label
    private labelChildren: Array<Label> | undefined;
    //array of artifacts using the label
    private artifacts: Array<StringArtifact> | undefined;
    //array of users that have used the label
    private users: Array<User> | undefined;
    //array of themes that belong to the label
    private themes: Array<Theme> | undefined;
    //deletion status of the label
    private deleted: boolean | undefined;

    /**
     * Constructor of a label
     * @param id
     * @param name
     * @param desc
     * @param type
     */
    constructor(id: number, name: string, desc: string, type: string) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.type = type;
    }

    /**
     * Returns label ID
     * @returns this.id
     */
    getId(): number {
        return this.id;
    }

    /**
     * Sets label ID
     * @param id 
     */
    setId(id: number): void {
        if (id == undefined || typeof id != "number" || id == null) {
            throw new Error("label id should be a number");
        } else if (id <= 0) {
            throw new Error("label id should be larger or equal to 1")
        }
        this.id = id;
    }

    /**
     * Returns label name
     * @returns this.name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Sets label name
     * @param name: string 
     */
    setName(name: string): void {
        if (name == undefined || typeof name != "string" || name.length <= 0) {
            throw new Error("The label name should not be of length 0 as an argument in setName()");
        }
        this.name = name;
    }

    /**
     * returns label description
     * @returns this.desc
     */
    getDesc(): string {
        return this.desc;
    }

    /**
     * sets label description
     * @param desc
     */
    setDesc(desc: string): void {
        if (desc == undefined || typeof desc != "string" || desc.length <= 0) {
            throw new Error("The label description should not be of length 0 as an argument in setDesc()");
        }
        this.desc = desc;
    }

    /**
     * returns label type
     * @returns this.type
     */
    getType(): string {
        return this.type;
    }

    /**
     * sets label type
     * @param type
     */
    setType(type: string): void {
        if (type == undefined || typeof type != "string" || type.length < 0) {
            throw new Error("The label type should not be of length 0 as an argument in setType()");
        }
        this.type = type;
    }

    /**
     * Function returns the parent labels
     * @returns this.labelParents
     */
    getParents(): Array<Label> | undefined {
        return this.labelParents;
    }

    /**
     * Sets the parent labels 
     * @param labelParents 
     */
    setParents(labelParents: Array<Label> | undefined): void {
        this.labelParents = labelParents
    }

    /**
     * Function get the number of parent labels
     * @return this.themeParents.length
     */
    getNumberOfParents(): number | undefined {
        let parentsVar = this.labelParents;
        // Make sure the parents are defined when calling
        if (parentsVar != undefined) {
            return parentsVar.length;
        } else {
            return 0;
        }
    }

    /**
     * Function returns the children labels
     * @returns this.labelChildren
     */
    getChildren(): Array<Label> | undefined {
        return this.labelChildren;
    }

    /**
     * Sets the children labels 
     * @param labelChildren
     */
    setChildren(labelChildren: Array<Label> | undefined): void {
        this.labelChildren = labelChildren
    }

    /**
     * Function get the number of child labels
     * @return this.labelChildren.length
     */
    getNumberOfChildren(): number | undefined {
        let childrenVar = this.labelChildren;
        // Make sure the children are defined when calling
        if (childrenVar != undefined) {
            return childrenVar.length;
        } else {
            return 0;
        }
    }

    /**
     * Function returns the artifacts of label
     * @returns this.artifacts
     */
    getArtifacts(): Array<StringArtifact> | undefined {
        return this.artifacts;
    }

    /**
     * Sets the artifacts of label 
     * @param artifacts
     */
    setArtifacts(artifacts: Array<StringArtifact> | undefined): void {
        this.artifacts = artifacts;
    }

    /**
     * Returns the amount of artifacts connected to this label if the array has been defined.
     * @returns artifacts.length
     */
    getNumberOfArtifacts(): number {
        if (this.artifacts == undefined) {
            return 0;
        } else {
            return this.artifacts.length;
        }
    }

    /**
     * Function returns the users who have used the label
     * @returns this.users
     */
    getUsers(): Array<User> | undefined {
        return this.users;
    }

    /**
     * Sets user who has used the label 
     * @param users
     */
    setUsers(users: Array<User> | undefined): void {
        this.users = users;
    }

    /**
     * Returns the amount of users connected to this label if the array has been defined.
     * @returns users.length
     */
    getNumberOfUsers(): number {
        if (this.users == undefined) {
            return 0;
        } else {
            return this.users.length;
        }
    }

    /**
     * Function returns the themes of label
     * @returns this.themess
     */
    getThemes(): Array<Theme> | undefined {
        return this.themes;
    }

    /**
     * Sets the themess of label 
     * @param themes
     */
    setThemes(themes: Array<Theme> | undefined): void {
        this.themes = themes;
    }

    /**
     * Returns the amount of themes connected to this label if the array has been defined.
     * @returns themes.length
     */
    getNumberOfThemes(): number {
        if (this.themes == undefined) {
            return 0;
        } else {
            return this.themes.length;
        }
    }

    /**
     * Function returns label deletion status
     * @returns this.deleted
     */
    getDeleted(): boolean | undefined {
        return this.deleted;
    }

    /**
     * Sets the label deletion status
     * @param deleted
     */
    setDeleted(deleted: boolean | undefined): void {
        this.deleted = deleted
    }
}
