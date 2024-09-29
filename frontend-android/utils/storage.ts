import AsyncStorage from "@react-native-async-storage/async-storage";

export function saveToStorage(key: string, data: any) {
    return AsyncStorage.setItem(key, data);
}

export function loadFromStorage(key: string) {
    return AsyncStorage.getItem(key);
}