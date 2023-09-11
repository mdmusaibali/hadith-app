import {
  TouchableOpacity,
  View,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import { List, RadioButton, Text, Switch } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Theme, settingsActions } from "../store/slice/settings";
import {
  getItemFromLocalStorage,
  storeItemInLocalStorage,
} from "../util/helper";
import { useEffect, useState } from "react";
import { firebase } from "@react-native-firebase/messaging";

const SettingsScreen = () => {
  const theme = useAppSelector((state) => state.settings.theme);
  const dispatch = useAppDispatch();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [settingFcmNoti, setSettingFcmNoti] = useState(false);
  const defaultAppMessaging = firebase.messaging();

  const onToggleSwitch = async () => {
    setSettingFcmNoti(true);
    try {
      if (isSwitchOn) {
        const unSubscribe = await defaultAppMessaging.unsubscribeFromTopic(
          "hadith"
        );
        ToastAndroid.show(
          "You have unsubscribed from daily hadiths",
          ToastAndroid.LONG
        );
        console.log(unSubscribe);
        await storeItemInLocalStorage("isSubscribed", false);
        setIsSwitchOn(false);
      } else {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (response === "denied") {
          ToastAndroid.show(
            "Need notifications permission for this",
            ToastAndroid.SHORT
          );
          return;
        }
        if (response === "never_ask_again") {
          ToastAndroid.show(
            "Please enable notifications from settings",
            ToastAndroid.LONG
          );
        }
        // const token = await defaultAppMessaging.getToken();
        const subscription = await defaultAppMessaging.subscribeToTopic(
          "hadith"
        );
        ToastAndroid.show(
          "You are now subscribed to daily hadiths",
          ToastAndroid.LONG
        );
        await storeItemInLocalStorage("isSubscribed", true);
        setIsSwitchOn(true);
        console.log(subscription);
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(
          `Something went wrong ${error.message}`,
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(`Something went wrong`, ToastAndroid.SHORT);
      }
      console.log(error);
    }
    setSettingFcmNoti(false);
  };

  const toggleMode = async (val: Theme) => {
    if (val) await storeItemInLocalStorage("theme", val);
    dispatch(settingsActions.setTheme({ theme: val }));
  };

  useEffect(() => {
    (async () => {
      const isSubscribed = await getItemFromLocalStorage("isSubscribed");
      if (isSubscribed === "true") {
        setIsSwitchOn(true);
      }
    })();
  }, []);

  return (
    <List.Section>
      <List.Subheader>Theme</List.Subheader>
      <View style={{ marginLeft: 16 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={toggleMode.bind(null, "Light")}
        >
          <RadioButton
            value="Light"
            onPress={toggleMode.bind(null, "Light")}
            status={theme === "Light" ? "checked" : "unchecked"}
          />
          <Text>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={toggleMode.bind(null, "Dark")}
        >
          <RadioButton
            value="Dark"
            onPress={toggleMode.bind(null, "Dark")}
            status={theme === "Dark" ? "checked" : "unchecked"}
          />
          <Text>Dark</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={toggleMode.bind(null, "System")}
        >
          <RadioButton
            value="System"
            onPress={toggleMode.bind(null, "System")}
            status={theme === "System" ? "checked" : "unchecked"}
          />
          <Text>System</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <List.Subheader>Subscribe to daily hadiths</List.Subheader>
        <Switch
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
          disabled={settingFcmNoti}
        />
      </View>
    </List.Section>
  );
};

export default SettingsScreen;
