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

export async function updateStorageItem (itemName, data) {
    let dataFromStotage = await getStorageItem(itemName);
    let foundIndex = dataFromStotage.findIndex(item => item.id == data.id);
    let currentNote = dataFromStotage.find(item => item.id == data.id);
    currentNote.lastUpdatingDate = data.lastUpdatingDate;
    currentNote.text = data.changedtext;
    dataFromStotage[foundIndex] = currentNote;
    return await setStorageItem(itemName, dataFromStotage);
}

export async function removeStorageItem (itemName, data) {
    let dataFromStotage = await getStorageItem(itemName);
    let filteredItems = dataFromStotage.filter((item) => !data.includes(item.id))
    return await setStorageItem(itemName, filteredItems);
}