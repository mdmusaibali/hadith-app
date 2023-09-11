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
import DailyHadith from "../screens/DailyHadith";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
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
        name="Books"
        component={BooksScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather size={size} name="book-open" color={color} />
          ),
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
};

export default function Navigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Books"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Daily"
        component={DailyHadith}
        options={{ headerTitle: "Daily Hadith" }}
      />
      <Stack.Screen name="Chapters" component={ChaptersScreen} />
      <Stack.Screen name="Hadiths" component={HadithsScreen} />
    </Stack.Navigator>
  );
}
