// Veerle Furst

export class Labelling {
    // Id of the user
    private userId: number;
    // Username of the user
    private username: string;
    // Labels given by this user
    private labels: Array<any>;

    /**
     * Constructor sets id, name and labels
     * @param id
     * @param name 
     * @param labels
     */
    constructor(id: number, name: string, labels: Array<any>) {
        this.userId = id;
        this.username = name;
        this.labels = labels;
    }

    /**
     * Gets the userId
     * @returns this.userId
     */
    getUserId(): number {
        return this.userId;
    }

    /**
     * Sets the userId
     * @param userId 
     */
    setUserId(userId: number): void {
        this.userId = userId;
    }

    /**
     * Gets the username
     * @returns this.username
     */
    getUsername(): string {
        return this.username;
    }

    /**
     * Sets the username
     * @param username 
     */
    setUsername(username: string): void {
        this.username = username;
    }

    /**
     * Gets the labels
     * @returns this.labels
     */
    getLabels(): Array<any> {
        return this.labels;
    }

    /**
     * Sets the labels
     * @param labels 
     */
    setLabels(labels: Array<any>): void {
        this.labels = labels;
    }

    /**
     * Gets the number of labels given to the artifact
     * @return this.labels.length 
     */
    getNumberOfLabels(): number {
        return this.labels.length;
    }
}