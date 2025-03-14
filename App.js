import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import LottieView from "lottie-react-native"; // Import Lottie
import { View, StyleSheet } from "react-native";

// Import Screens
import LoginSignupScreen from "./screens/LoginSignupScreen";
import ClassesScreen from "./screens/ClassesScreen";
import SpecificClass from "./screens/SpecificClass";
import SettingsScreen from "./screens/SettingsScreen";
import ClassManagerScreen from "./screens/ClassManagerScreen";
import HomeScreen from "./screens/homeScreen";
import AIChat from "./screens/AIChat";


const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setTimeout(() => setLoading(false), 1100); 
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <LottieView
          source={require("./assets/splash.json")} 
          autoPlay
          loop={false}
          style={styles.lottie}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Home" : "Login"}
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
        {!user ? (
          <Stack.Screen name="Login" component={LoginSignupScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" options={{ title: "Calendar" }}>
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="SpecificClass" component={SpecificClass} options={{ title: "Class" }} />
            <Stack.Screen name="Classes" component={ClassesScreen} options={{ title: "Classes" }} />
            <Stack.Screen name="AIChat" component={AIChat} options={{ title: "AIChat" }} />
            <Stack.Screen name="Settings" options={{ title: "Settings" }}>
              {(props) => <SettingsScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="ClassManager" component={ClassManagerScreen} options={{ title: "Classes" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Change background if needed
  },
  lottie: {
    flex: 1, // Expands to full screen
    width: "100%",
    height: "100%",
  },
});