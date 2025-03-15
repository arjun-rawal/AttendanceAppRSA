import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; // import your Firestore db
import HomeNavBar from "../components/HomeNavBar";

export default function ClassManagerScreen({ navigation, user }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example: fetch user doc by user.uid or user.email
  // Then fetch all class docs that match IDs in user.classes
  useEffect(() => {
    const fetchUserAndClasses = async () => {
      try {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        // 1) Get the user doc
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          console.log("User doc not found");
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const classIds = userData.classes || [];

        if (classIds.length === 0) {
          // No classes
          setClasses([]);
          setLoading(false);
          return;
        }

        // 2) Fetch all class docs from the "Classes" collection
        // where Classes.Id is in the user’s classes array
        const classesRef = collection(db, "Classes");
        // If your Firestore structure uses 'Classes.Id' as a field,
        // you'll need a query like this:
        const q = query(classesRef, where("Id", "in", classIds));
        // Note: "in" queries only support max 10 items. If more, do in batches.

        const querySnapshot = await getDocs(q);

        const fetchedClasses = [];
        querySnapshot.forEach((docSnap) => {
          const cData = docSnap.data();
          // cData.Id, cData.name, etc.
          fetchedClasses.push({
            id: docSnap.id, // Firestore doc ID
            classId: cData.Id, // "Classes.Id"
            name: cData.name,
            absences: 0, // If you want to store # of absences from somewhere else
          });
        });

        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndClasses();
  }, [user]);

  // Placeholder function for syncing with Google Classroom
  const syncGoogleClassroom = () => {
    console.log("Syncing with Google Classroom...");
    // Implement your API call logic if needed
  };

  // Placeholder function for manually adding a class
  const addClassManually = () => {
    console.log("Adding class manually...");
    // Implement a modal or form logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Your Classes</Text>

      {/* Buttons for Syncing & Adding Classes */}
      <View style={styles.buttonContainer}>
        <Button
          title="Sync Google Classroom"
          onPress={syncGoogleClassroom}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Add Class Manually"
          onPress={addClassManually}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : classes.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No classes</Text>
      ) : (
        // Scrollable List of Classes
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
      )}

      <HomeNavBar initialIndex={1} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "column",
    rowGap: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
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
