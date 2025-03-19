import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import LottieView from "lottie-react-native";
import { View, StyleSheet, ActivityIndicator, LogBox } from "react-native";

import LoginSignupScreen from "./screens/LoginSignupScreen";
import SpecificClass from "./screens/SpecificClass";
import SettingsScreen from "./screens/SettingsScreen";
import ClassManagerScreen from "./screens/ClassManagerScreen";
import HomeScreen from "./screens/homeScreen";
import AIChat from "./screens/Assistant";
import ForumScreen from "./screens/Forum";
import ContentScreen from "./screens/ContentScreen";
import EditContentScreen from "./screens/EditContentScreen";
import TeacherDashboard from "./screens/TeacherDashboard";
const Stack = createStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.error("User document not found!");
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          transitionSpec: {
            open: { animation: "timing", config: { duration: 500 } },
            close: { animation: "timing", config: { duration: 500 } },
          },
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          animation: "fade",
        }}
      >
        {!user && (
          <Stack.Screen
            name="Login"
            component={LoginSignupScreen}
            options={{ headerShown: false }}
          />
        )}

        {
          <>
            <Stack.Screen name="Home" options={{ title: "Calendar" }}>
              {(props) => <HomeScreen {...props} user={user} role={role} />}
            </Stack.Screen>
            <Stack.Screen name="ClassManager">
              {(props) => <ClassManagerScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Settings">
              {(props) => <SettingsScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Assistant">
              {(props) => <AIChat {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Forum">
              {(props) => <ForumScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Content">
              {(props) => <ContentScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="TeacherDashboard"
              options={{ title: "TeacherDashboard" }}
            >
              {(props) => <TeacherDashboard {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="LoginReCall"
              component={LoginSignupScreen}
              options={{ headerShown: false }}
            />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
