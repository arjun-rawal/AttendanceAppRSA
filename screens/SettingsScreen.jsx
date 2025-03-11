import React from "react";
import { StyleSheet, View, Alert, Linking } from "react-native";
import { Button, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import HomeNavBar from "../components/HomeNavBar";

export default function SettingsScreen({ navigation, user }) {
  // Function to delete classes (Replace with actual logic)
  const handleDeleteClasses = () => {
    Alert.alert(
      "Delete Classes",
      "Are you sure you want to delete all your classes? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => console.log("Classes Deleted") },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteUser(auth.currentUser);
              Alert.alert("Account Deleted", "Your account has been permanently deleted.");
              navigation.replace("LoginSignupScreen"); 
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete account. Try logging in again.");
            }
          },
        },
      ]
    );
  };

  return (
    <>
    <SafeAreaView style={styles.container}>
      <Text h4 style={styles.title}>Welcome {user.email}!</Text>

      <Button
        title="Sign Out"
        onPress={() => signOut(auth).catch((err) => console.error(err))}
        buttonStyle={styles.button}
      />

      <Button
        title="Delete Classes"
        onPress={handleDeleteClasses}
        buttonStyle={[styles.button, { backgroundColor: "orange" }]}
      />

      <Button
        title="Delete Account"
        onPress={handleDeleteAccount}
        buttonStyle={[styles.button, { backgroundColor: "red" }]}
      />

      <View style={styles.linksContainer}>
        <Text style={styles.link} onPress={() => Linking.openURL("https://yourwebsite.com/privacy-policy")}>
          Privacy Policy
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL("https://yourwebsite.com/terms-of-service")}>
          Terms of Service
        </Text>
      </View>
      <HomeNavBar initialIndex={2} />

    </SafeAreaView>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    marginVertical: 10,
    alignSelf: 'center'
  },
  linksContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
    marginTop: 5,
  },
});

