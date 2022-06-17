export class Changelog {

    /* id number of the item which was modified */
    private id: number;
    private name: string;
    private timestamp: string;
    private desc: string;

    constructor(id: number, name: string, timestamp: string, desc: string) {
        this.id = id;
        this.name = name;
        this.timestamp = timestamp;
        this.desc = desc;
    }

    setId(id: number): void {
        this.id = id;
    }

    getId(): number {
        return this.id;
    }

    setName(name: string): void {
        this.name = name;
    }

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
