import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars'; // Import calendar
import BottomNavBar from './components/BottomNavBar';
import LoginSignupScreen from './components/LoginSignupScreen'; 
import ClassesScreen from './components/ClassesScreen'; // New classes screen
import SpecificClass from './components/SpecificClass'; // New specific class screen

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
        <Stack.Screen name="Home" options={{ title: 'Calendar' }}>
          {({ navigation }) => (
            <SafeAreaView style={styles.container}>
              <View style={styles.content}>
                <Text style={styles.text}>You are logged in!</Text>

                {/* Sign out button */}
                <Button
                  title="Sign Out"
                  onPress={() => signOut(auth).catch((err) => console.error(err))}
                />

                {/* Calendar component */}
                <Calendar
                  markedDates={{
                    '2025-03-12': { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
                    '2025-03-15': { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
                    // TODO: update using google classroom/teacher backend, make this interact more with classes screen
                  }}
                  onDayPress={(day) => {
                    // go to classes screen with the selected date
                    navigation.navigate('Classes', { selectedDate: day.dateString });
                  }}
                />
              </View>
              <BottomNavBar />
            </SafeAreaView>
          )}
        </Stack.Screen>
        <Stack.Screen name="SpecificClass" component={SpecificClass} />
        <Stack.Screen name="Classes" component={ClassesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80, // so content doesn't get hidden behind nav bar
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
});
