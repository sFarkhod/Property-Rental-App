import React from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
  View,
} from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import RegisterScreen from "./components/Register";
import LoginScreen from "./components/Login";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/Home";
import { Provider } from 'react-redux';
import store from "./src/redux/store";
import AddRealEstateScreen from "./components/AddRealEstateScreen";
import UserProfileScreen from "./components/UserProfile";
import RealEstateDetail from "./components/RealEstateDetail";
import EditRealEstateScreen from "./components/EditRealEstateScreen";
import PasswordResetRequest from "./components/PasswordResetRequest";
import PasswordResetConfirmation from "./components/PasswordResetConfirmation";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}

// for navigation
const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddRealEstate"
              component={AddRealEstateScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={UserProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RealEstateDetail"
              component={RealEstateDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditRealEstateScreen"
              component={EditRealEstateScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PasswordResetRequest"
              component={PasswordResetRequest}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PasswordResetConfirmation"
              component={PasswordResetConfirmation}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
