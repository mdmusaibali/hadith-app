import { TouchableOpacity, View, ToastAndroid } from "react-native";
import { List, RadioButton, Text, Switch } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Theme, settingsActions } from "../store/slice/settings";
import {
  getItemFromLocalStorage,
  handleNotificationPermissions,
  storeItemInLocalStorage,
  subscribeForDailyHadiths,
  unsubscribeFromDailyHadiths,
} from "../util/helper";
import { useEffect, useState } from "react";

const SettingsScreen = () => {
  const theme = useAppSelector((state) => state.settings.theme);
  const dispatch = useAppDispatch();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [settingFcmNoti, setSettingFcmNoti] = useState(false);

  const onToggleSwitch = async () => {
    setSettingFcmNoti(true);
    try {
      if (isSwitchOn) {
        await unsubscribeFromDailyHadiths();
        setIsSwitchOn(false);
      } else {
        await handleNotificationPermissions();
        await subscribeForDailyHadiths();
        setIsSwitchOn(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
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
