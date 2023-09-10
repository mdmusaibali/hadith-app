import { Button, TouchableOpacity, View } from "react-native";
import { List, RadioButton, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Theme, settingsActions } from "../store/slice/settings";
import { storeItemInLocalStorage } from "../util/helper";
import notifee, {
  AndroidStyle,
  IntervalTrigger,
  TriggerType,
  TimeUnit,
} from "@notifee/react-native";

const trigger: IntervalTrigger = {
  type: TriggerType.INTERVAL,
  interval: 15,
  timeUnit: TimeUnit.MINUTES,
};

const SettingsScreen = () => {
  const theme = useAppSelector((state) => state.settings.theme);
  const dispatch = useAppDispatch();

  const toggleMode = async (val: Theme) => {
    if (val) await storeItemInLocalStorage("theme", val);
    dispatch(settingsActions.setTheme({ theme: val }));
  };

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
    </List.Section>
  );
};

export default SettingsScreen;
