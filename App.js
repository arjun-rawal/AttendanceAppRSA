// App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Button } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { auth } from './firebaseConfig'; 
import BottomNavBar from './components/BottomNavBar';
import LoginSignupScreen from './components/LoginSignupScreen'; // Replace old screen

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

  // User is authenticated, show main content
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>You are logged in!</Text>

        {/* Sign out button */}
        <Button
          title="Sign Out"
          onPress={() => signOut(auth).catch((err) => console.error(err))}
        />
      </View>

      <BottomNavBar />
    </SafeAreaView>
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
