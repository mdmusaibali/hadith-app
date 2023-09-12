import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, ToastAndroid } from "react-native";
import { firebase } from "@react-native-firebase/messaging";

export const removeEscapeCharacters = (input: string) => {
  // Replace backslashes with an empty string
  return input.replace(/\\/g, "");
};

export const decodeString = (str: string) => {
  return str.replace(/\\u([\dA-F]{4})/gi, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
};

export const storeItemInLocalStorage = async (
  key: string,
  val: string | Boolean
) => {
  try {
    await AsyncStorage.setItem(key, String(val));
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

export const handleNotificationPermissions = async () => {
  const response = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  if (response === "denied") {
    throw new Error("Need notifications permission for this");
  }
  if (response === "never_ask_again") {
    ToastAndroid.show(
      "Please enable notifications from settings.",
      ToastAndroid.LONG
    );
  }
};

export const subscribeForDailyHadiths = async (showUnsubMessage?: boolean) => {
  await firebase.messaging().subscribeToTopic("hadith");
  const message = showUnsubMessage
    ? "You are subscribed to daily hadiths. You can unsubscribe from settings."
    : "You are now subscribed to daily hadiths";
  ToastAndroid.show(message, ToastAndroid.LONG);
  await storeItemInLocalStorage("isSubscribed", true);
};

export const unsubscribeFromDailyHadiths = async () => {
  await firebase.messaging().unsubscribeFromTopic("hadith");
  ToastAndroid.show(
    "You have unsubscribed from daily hadiths",
    ToastAndroid.LONG
  );
  await storeItemInLocalStorage("isSubscribed", false);
};
