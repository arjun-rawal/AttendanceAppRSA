import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeNavBar from "../components/HomeNavBar";

export default function ClassManagerScreen({navigation}) {
  // Sample classes with default absence count
  const [classes, setClasses] = useState([
    { id: "1", name: "Math 101", absences: 0 },
    { id: "2", name: "History", absences: 0 },
    { id: "3", name: "Physics", absences: 0 },
  ]);

  // Placeholder function for syncing with Google Classroom
  const syncGoogleClassroom = () => {
    console.log("Syncing with Google Classroom...");
    // You can implement API call logic here
  };

  // Placeholder function for manually adding a class
  const addClassManually = () => {
    console.log("Adding class manually...");
    // You can implement modal or form logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h4 style={styles.header}>Manage Your Classes</Text>

      {/* Buttons for Syncing & Adding Classes */}
      <View style={styles.buttonContainer}>
        <Button title="Sync Google Classroom" onPress={syncGoogleClassroom} buttonStyle={styles.button} />
        <Button title="Add Class Manually" onPress={addClassManually} buttonStyle={styles.button} />
      </View>

      {/* Scrollable List of Classes */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.classItem}>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.absences}>Absences: {item.absences}</Text>
          </View>
        )}
      />
      <HomeNavBar initialIndex={1} navigation={navigation}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: 'space-between',
    rowGap: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    
  },
  classItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  absences: {
    fontSize: 16,
    color: "gray",
  },
});

