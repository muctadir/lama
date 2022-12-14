export class User {

    // Unique id number of the user
    private id: number;
    // Username of the user
    private username: string;
    // Email address of the user
    private email: string | undefined;
    // String containing the description of the user
    private description: string | undefined;
    // Status of the user
    private status: string | undefined;
    // Type of the user
    private type: boolean | undefined;

    constructor(id: number, username: string) {
        this.id = id;
        this.username = username;
    }

    /**
    * Gets the id of the user
    * @returns this.id
    */
    getId(): number {
        return this.id;
    }

    /**
    * Sets the id of the user
    * @params id
    */
    setId(id: number): void {
        this.id = id;
    }

    /**
    * Gets the username of the user
    * @returns this.username
    */
    getUsername(): string {
        return this.username;
    }

    /**
    * Sets the username of the user
    * @params username
    */
    setUsername(username: string): void {
        if (username == undefined || typeof username != "string" || username.length <= 0) {
            throw new Error("The username should not be of length 0 as an argument in setUserame()");
        }
        this.username = username;
    }

    /**
    * Gets the email of the user
    * @returns this.email
    */
    getEmail(): string | undefined {
        return this.email;
    }

    /**
    * Sets the email of the user
    * @params email
    */
    setEmail(email: string): void {
        this.email = email;
    }

    /**
    * Gets the description of the user
    * @returns this.description
    */
    getDesc(): string | undefined {
        return this.description;
    }

    /**
    * Gets the description of the user
    * @params desc
    */
    setDesc(desc: string): void {
        this.description = desc;
    }

    /**
    * Gets the status of the user
    * @returns this.status
    */
    getStatus(): string | undefined {
        return this.status;
    }

    /**
    * Gets the status of the user
    * @params status
    */
    setStatus(status: string): void {
        this.status = status;
    }

    /**
     * Gets the type of the user
     * @returns this.type
    */
    getType(): boolean | undefined {
        return this.type;
    }

    /**
    * Gets the type of the user
    * @params type
    */
    setType(type: boolean): void {
        this.type = type;
    }
}
