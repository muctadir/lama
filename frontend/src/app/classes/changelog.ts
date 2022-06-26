/**
 * @author T. Bradley
 */
export class Changelog {

    /* username of the user who made the change */
    private name: string;
    /* timestamp of the modification */
    private timestamp: string;
    /* string explaining the modification */
    private desc: string;

    /**
     * Creates the Changelog object
     * 
     * @param name name of user making the change
     * @param timestamp time of change
     * @param desc description of the change
     */
    constructor(name: string, timestamp: string, desc: string) {
        this.name = name;
        this.timestamp = timestamp;
        this.desc = desc;
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

    /**
     * Sets the timestamp of when the item was changed
     */
    setTimestamp(timestamp: string): void {
        this.timestamp = timestamp;
    }

    /**
     * Gets the timestamp of when the item was changed
     */
    getTimestamp(): string {
        return this.timestamp;
    }

    /**
     * Sets the description of the item change
     */
    setDesc(desc: string): void {
        this.desc = desc;
    }

    /**
     * Gets the description of the item change
     */
    getDesc(): string {
        return this.desc;
    }
}
