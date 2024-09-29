import {stateAbbreviations, stateNames} from "../constants";

export const getStateAbbreviation = (stateName: string): string | null => {
    const formattedStateName = stateName.toLowerCase().trim();

    // Loop through the stateAbbreviations object to find the matching state name
    for (const [abbr, name] of Object.entries(stateAbbreviations)) {
        if (name === formattedStateName) {
            return abbr; // Return the abbreviation in uppercase (e.g., "TX")
        }
    }

    // If no match is found, return null
    return null;
};

export const getStateFromLocation = (location: string): string | null => {
    const lowerCaseLocation = location.toLowerCase();

    // Check for full state names
    for (const state of stateNames) {
        if (lowerCaseLocation.includes(state)) {
            return state;
        }
    }

    // Check for state abbreviations
    for (const [abbreviation, state] of Object.entries(stateAbbreviations)) {
        const regex = new RegExp(`\\b${abbreviation}\\b`, 'i'); // Ensure it's a word boundary match (e.g., 'TX' not part of another word)
        if (regex.test(lowerCaseLocation)) {
            return state;
        }
    }

    // If no state is found, return null
    return null;
};

export const getStateAbbrFromLocation = (location: string):string => {
    const state = getStateFromLocation(location);
    const abbr = getStateAbbreviation(state || "");
    return abbr || 'us';
}