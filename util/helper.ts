import AsyncStorage from "@react-native-async-storage/async-storage";
export const removeEscapeCharacters = (input: string) => {
  // Replace backslashes with an empty string
  return input.replace(/\\/g, "");
};

export const decodeString = (str: string) => {
  return str.replace(/\\u([\dA-F]{4})/gi, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
};

export const storeItemInLocalStorage = async (key: string, val: string) => {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (e) {
    // saving error
  }
};

export const getItemFromLocalStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
  }
  return null;
};
