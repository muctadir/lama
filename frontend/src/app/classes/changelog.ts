export class Changelog {

    /* id number of the item which was modified */
    private id: number;
    /* username of the user who made the change */
    private name: string;
    /* timestamp of the modification */
    private timestamp: string;
    /* string explaining the modification */
    private desc: string;

    /**
     * Creates the Changelog object
     * 
     * @param id id of item that is changed
     * @param name name of user making the change
     * @param timestamp time of change
     * @param desc description of the change
     */
    constructor(id: number, name: string, timestamp: string, desc: string) {
        this.id = id;
        this.name = name;
        this.timestamp = timestamp;
        this.desc = desc;
    }

    /**
     * Sets the id of the item changed
     */
    setId(id: number): void {
        this.id = id;
    }

    /**
     * Gets the id of the item changed
     */
    getId(): number {
        return this.id;
    }

    /**
     * Sets the name of who changed the item
     */
    setName(name: string): void {
        this.name = name;
    }

    /**
     * Gets the name of who changed the item
     */
    getName(): string {
        return this.name;
    }

    setTimestamp(timestamp: string): void {
        this.timestamp = timestamp;
    }

    getTimestamp(): string {
        return this.timestamp;
    }

    setDesc(desc: string): void {
        this.desc = desc;
    }

    getDesc(): string {
        return this.desc;
    }
}
