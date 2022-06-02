export class User {
    
    // Unique id number of the user account
    private id: number;
    // Username of the user account
    private username: string;
    // Email address of the user account
    private email : string;
    // String containing the description of the user account
    private description: string;

    constructor (id:number, username: string, 
        email: string, description: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.description = description;
    }

    /**
     * Gets the id of the user
     * @returns this.id
     */
    getId (): number {
        return this.id;
    }

    /**
     * Gets the username of the user
     * @returns this.username
     */
    getUsername () : string {
        return this.username;
    }

    /**
     * Gets the email of the user
     * @returns 
     */
    getEmail () : string {
        return this.email;
    }

    /**
     * Gets the description of the user
     * @returns 
     */
    getDescription () : string {
        return this.description;
    }
}
