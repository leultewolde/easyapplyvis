import {DEFAULT_PORT, URL_PREFIX} from "../constants";

export const constructUrl = (ip: string) => `${URL_PREFIX}://${ip}:${DEFAULT_PORT}`

export const capitalizeWords = (sentence: string) => {
    return sentence.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}

export const camelCaseToSentence = (camelCaseStr: string) => {
    let result = camelCaseStr.replace(/([A-Z])/g, ' $1');
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result.trim();
}

export * from './stats';
export * from './companies';
export * from './locations';
export * from './storage';