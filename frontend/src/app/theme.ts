/**
 * @author B. Henkemans
 */
export class Theme {
    private themeName: String;
    private themeDescription: String;
    private themeParentIDs: Array<Number> | undefined;
    private themeChildIDs: Array<Number> | undefined;
    private labelIDs: Array<Number> | undefined;

    constructor (themeName: String, themeDescription: String) {
        this.themeName = themeName;
        this.themeDescription = themeDescription;
    }

    /**
     * Function returns theme name
     * @returns this.themeName
     */
    getThemeName(): String {
        return this.themeName;
    }

    /**
     * Sets the theme name
     * @param themeName 
     */
    setThemeName(themeName: String) {
        this.themeName = themeName;
    }

    /**
     * Function returns the theme description
     * @returns this.themeDescription
     */
    getThemeDescription(): String {
        return this.themeDescription;
    }

    /**
     * Sets the theme description
     * @param themeDescription 
     */
    setThemeDescription(themeDescription: String) {
        this.themeDescription = themeDescription;
    }

    /**
     * Returns the amount of labels connected to this theme if the array has been defined.
     * @returns labelIDs.length
     */
    getLabelCount(): Number {
        if (this.labelIDs == undefined) {
            return 0;
        } else {
            return this.labelIDs.length;
        }
    }

    

    
}
