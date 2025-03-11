import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Calendar } from "react-native-calendars"; // Import calendar
import LoginSignupScreen from "./screens/LoginSignupScreen";
import ClassesScreen from "./screens/ClassesScreen"; // New classes screen
import SpecificClass from "./screens/SpecificClass"; // New specific class screen
import HomeScreen from "./screens/homeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ClassManagerScreen from "./screens/ClassManagerScreen";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // If not logged in, show the EnhancedAuthScreen
  if (!user) {
    return <LoginSignupScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{
            title: "Calendar",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          {(props) => <HomeScreen {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="SpecificClass"
          component={SpecificClass}
          options={{
            title: "Class",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Classes"
          component={ClassesScreen}
          options={{
            title: "Classes",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          options={{
            title: "Settings",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          {(props) => <SettingsScreen {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="ClassManager"
          component={ClassManagerScreen}
          options={{
            title: "Classes",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
