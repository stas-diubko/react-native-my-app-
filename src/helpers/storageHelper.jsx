import { AsyncStorage } from 'react-native';

export async function getStorageItem (itemName) {
    let data = await AsyncStorage.getItem(itemName);
    let dataParsed = JSON.parse(data);
    return dataParsed;
}

export async function setStorageItem (itemName, data) {
    let dataString = JSON.stringify(data);
    return await AsyncStorage.setItem(itemName, dataString);
}