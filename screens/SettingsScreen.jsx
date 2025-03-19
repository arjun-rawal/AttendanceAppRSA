import React from "react";
import { StyleSheet, View, Alert, Linking } from "react-native";
import { Button, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import HomeNavBar from "../components/HomeNavBar";
import { styled } from "nativewind";
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen({ navigation, user }) {
  const StyledText = styled(Text);
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
    <SafeAreaView style={styles.container} edges={['left, right']}>
     <LinearGradient colors={['rgba(255, 122, 43, 0.8)', 'rgba(255, 184, 77, 0.8)', 'rgba(255, 122, 43, 0.8)']}
      className="flex-1 w-full">
     <Text className="font-extrabold text-left text-3xl text-white ml-5 mt-2 text-center">
               Welcome
             </Text>
             <Text className="font-extrabold text-left text-2xl text-white ml-5 mb-2">
             {user?.email}!
             </Text>
      
      <Button
        title="Sign Out"
        onPress={() => signOut(auth).catch((err) => console.error(err))}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        className="ml-2 mr-2 mt-2"
      />

      <Button
        title="Delete Classes"
        onPress={handleDeleteClasses}
        buttonStyle={[styles.button, { backgroundColor: "orange" }]}
        titleStyle={styles.buttonText}
        className="ml-2 mr-2 mt-2"
      />

      <Button
        title="Delete Account"
        onPress={handleDeleteAccount}
        buttonStyle={[styles.button, { backgroundColor: "red" }]}
        titleStyle={styles.buttonText}
        className="ml-2 mr-2 mt-2"
      />

      <View className="justify-center items-center mt-80">
        <Text className="font-extrabold underline text-white " onPress={() => Linking.openURL("https://yourwebsite.com/privacy-policy")}>
          Privacy Policy
        </Text>
        <Text className="font-extrabold underline text-white mt-1" onPress={() => Linking.openURL("https://yourwebsite.com/terms-of-service")}>
          Terms of Service
        </Text>
      </View>
      </LinearGradient>
      <HomeNavBar initialIndex={2} />

    </SafeAreaView>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f4511e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
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

