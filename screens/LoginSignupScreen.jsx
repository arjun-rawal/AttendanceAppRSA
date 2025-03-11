// EnhancedAuthScreen.js
import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Text, Input, Button } from 'react-native-elements';

export default function EnhancedAuthScreen() {
  // Toggle between "login" or "signup"
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      if (mode === 'login') {
        // LOGIN user
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        // SIGN UP user
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      // onAuthStateChanged in App.js will handle navigation
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    // Clear fields, error, and flip mode
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
      </Text>

      <Input
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        leftIcon={{ type: 'material', name: 'email' }}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        leftIcon={{ type: 'material', name: 'lock' }}
      />

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}

      {/* Action button */}
      <Button
        title={mode === 'login' ? 'Log In' : 'Sign Up'}
        onPress={handleAuthAction}
        containerStyle={styles.btnContainer}
      />

      {/* Loading spinner (shown when authenticating) */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

      {/* Toggle between Login & Signup */}
      <Button
        type="clear"
        title={
          mode === 'login'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Log In'
        }
        onPress={toggleMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  btnContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginHorizontal: 10,
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'center',
  },
});
