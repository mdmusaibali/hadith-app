import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  DarkTheme as NavigationDarkTheme,
  NavigationContainer,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import {
  DefaultTheme,
  MD3DarkTheme,
  Modal,
  PaperProvider,
  Text,
  adaptNavigationTheme,
} from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  getItemFromLocalStorage,
  handleNotificationPermissions,
  storeItemInLocalStorage,
  subscribeForDailyHadiths,
} from "./util/helper";
import { settingsActions } from "./store/slice/settings";
import Navigator from "./navigators/Navigator";
import { NoInternetModal } from "./components";

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialDark: MD3DarkTheme,
  materialLight: DefaultTheme,
});

SplashScreen.preventAutoHideAsync();
const Root = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = useAppSelector((state) => state.settings.theme);
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState<Boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // handling theme switching
    (async () => {
      const theme = await getItemFromLocalStorage("theme");
      if (!theme) dispatch(settingsActions.setTheme({ theme: "System" }));
      if (theme === "Light")
        dispatch(settingsActions.setTheme({ theme: "Light" }));
      if (theme === "System")
        dispatch(settingsActions.setTheme({ theme: "System" }));
      if (theme === "Dark")
        dispatch(settingsActions.setTheme({ theme: "Dark" }));
      await SplashScreen.hideAsync();
    })();

    // auto subscribe at first
    (async () => {
      const firstTimeSubscribed = await getItemFromLocalStorage("initSub");
      console.log("initSub status: ", firstTimeSubscribed);
      if (!firstTimeSubscribed) {
        try {
          await handleNotificationPermissions();
          await subscribeForDailyHadiths(true);
          await storeItemInLocalStorage("initSub", true);
        } catch (error) {
          console.log("Error initSub", error);
        }
      }
    })();
  }, []);

  const NavigationTheme =
    theme === "System"
      ? isDarkMode
        ? DarkTheme
        : LightTheme
      : theme === "Light"
      ? LightTheme
      : DarkTheme;

  const PaperProviderTheme =
    theme === "System"
      ? isDarkMode
        ? MD3DarkTheme
        : DefaultTheme
      : theme === "Light"
      ? DefaultTheme
      : MD3DarkTheme;

  return (
    <NavigationContainer theme={NavigationTheme}>
      <PaperProvider theme={PaperProviderTheme}>
        <StatusBar style="auto" />
        <Navigator />
        {!isConnected && <NoInternetModal />}
      </PaperProvider>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <StoreProvider store={store}>
      <Root />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
