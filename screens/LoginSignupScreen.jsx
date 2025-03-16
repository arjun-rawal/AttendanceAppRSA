// LoginSignupScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Animated, TouchableOpacity, Text as RNText } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Text, Input, Button, Card } from "react-native-elements";
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function EnhancedAuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent"); // default role
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("")

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const StyledButton = styled(Button);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, 
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAuthAction = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      let userCredential;
      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        if (!name.trim()) {
          setErrorMsg("Name is required");
          setLoading(false);
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        // Save user role and name to Firestore for new users
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email.trim(),
          role: role,
          name: name.trim(),
        });
        userCredential.user.updateProfile({
          displayName: displayName
      });
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setEmail("");
    setPassword("");
    setName("");
    setErrorMsg("");
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <View className="flex-1">
      <LinearGradient colors={['rgba(255, 80, 43, 0.8)', 'rgba(255, 160, 77, 0.8)', 'rgba(255, 80, 43, 0.8)']}
       className="w-full flex-1">
      <Animated.View style={[styles.fadeContainer, { opacity: fadeAnim }]}>
        <Card containerStyle={styles.card}>
          <Text h3 style={styles.title}>
            {mode === "login" ? "Welcome to Ketchup!" : "Create an Account"}
          </Text>

          <Input
            label="Email"
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            leftIcon={{ type: "material", name: "email", color: "#f4511e" }}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={{ type: "material", name: "lock", color: "#f4511e" }}
          />

          {mode === "signup" && (
            <>
              <Input
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                leftIcon={{ type: "material", name: "person", color: "#f4511e" }}
              />
              <View style={styles.roleContainer}>
                <RNText style={styles.roleLabel}>Select Role:</RNText>
                <View style={styles.roleButtons}>
                  <TouchableOpacity 
                    style={[styles.roleButton, role === "parent" && styles.selectedRole]}
                    onPress={() => setRole("parent")}
                  >
                    <RNText style={styles.roleButtonText}>Parent</RNText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.roleButton, role === "teacher" && styles.selectedRole]}
                    onPress={() => setRole("teacher")}
                  >
                    <RNText style={styles.roleButtonText}>Teacher</RNText>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <StyledButton
            title={mode === "login" ? "Log In" : "Sign Up"}
            titleStyle={styles.buttonText}
            onPress={handleAuthAction}
            buttonStyle={styles.primaryButton}
            disabled={loading} // Disable button while loading
          />

          {loading && <ActivityIndicator size="large" color="#f4511e" style={{ marginTop: 10 }} />}

          <StyledButton
            type="clear"
            title={
              mode === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"
            }
            onPress={toggleMode}
            titleStyle={{ color: "#f4511e", fontFamily: "Georgia" }}
            className="text-center"
          />
        </Card>
      </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fadeContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  card: {
    width: "95%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: "center",
    marginTop: 0,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#f4511e",
    fontFamily: "cursive",
    fontWeight: "bold"
  },
  primaryButton: {
    backgroundColor: "#f4511e",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: "cursive",
    fontWeight: "bold",
  },
  roleContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  roleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#f4511e",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: "#fadeb1"
  },
  roleButtonText: {
    color: "#f4511e",
  },
});