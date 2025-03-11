import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars'; // Import calendar
import BottomNavBar from './components/BottomNavBar';
import LoginSignupScreen from './screens/LoginSignupScreen'; 
import ClassesScreen from './screens/ClassesScreen'; // New classes screen
import SpecificClass from './screens/SpecificClass'; // New specific class screen
import HomeScreen from './screens/homeScreen';

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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Calendar' }}/>
        <Stack.Screen name="SpecificClass" component={SpecificClass} />
        <Stack.Screen name="Classes" component={ClassesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


