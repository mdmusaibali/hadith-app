import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme } from "react-native";
import {
  DarkTheme as NavigationDarkTheme,
  NavigationContainer,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import {
  DefaultTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import BottomTab from "./navigators/BottomTab";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { getItemFromLocalStorage } from "./util/helper";
import { settingsActions } from "./store/slice/settings";

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

  useEffect(() => {
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
  }, []);

  return (
    <NavigationContainer
      theme={
        theme === "System"
          ? isDarkMode
            ? DarkTheme
            : LightTheme
          : theme === "Light"
          ? LightTheme
          : DarkTheme
      }
    >
      <PaperProvider
        theme={
          theme === "System"
            ? isDarkMode
              ? MD3DarkTheme
              : DefaultTheme
            : theme === "Light"
            ? DefaultTheme
            : MD3DarkTheme
        }
      >
        <StatusBar style="auto" />
        <BottomTab />
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
