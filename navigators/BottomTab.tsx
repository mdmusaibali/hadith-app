import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BooksScreen,
  ChaptersScreen,
  HadithsScreen,
  SettingsScreen,
} from "../screens";
import { Feather } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const tabHiddenRoutes = ["Chapters", "Hadiths"];

const BooksNavigator = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName && tabHiddenRoutes.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Books" component={BooksScreen} />
      <Stack.Screen name="Chapters" component={ChaptersScreen} options={{}} />
      <Stack.Screen name="Hadiths" component={HadithsScreen} />
    </Stack.Navigator>
  );
};

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          marginTop: -4,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Books Navigator"
        component={BooksNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather size={size} name="book-open" color={color} />
          ),
          headerShown: false,
          tabBarLabel: "Books",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather size={size} name="settings" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
