import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Modal, TextInput } from "react-native";
import { Text, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import HomeNavBar from "../components/HomeNavBar";
import { LinearGradient } from "expo-linear-gradient";

export default function ClassManagerScreen({ navigation, user }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassId, setNewClassId] = useState(""); 

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
        const classIds = userData.Classes || [];
        const absences = userData.daysMissed?.length || 0;

        if (classIds.length === 0) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const classesRef = collection(db, "Classes");
        const q = query(classesRef, where("Id", "in", classIds));
        const querySnapshot = await getDocs(q);
        const fetchedClasses = [];
        querySnapshot.forEach((docSnap) => {
          const cData = docSnap.data();
          fetchedClasses.push({
            id: docSnap.id, 
            classId: cData.Id, 
            name: cData.Name,
            absences: absences,
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

  const syncGoogleClassroom = () => {
    console.log("Syncing with Google Classroom...");
  };

  const addClassManually = () => {
    setShowAddModal(true);
  };

  const handleAddClass = async () => {
    if (!newClassId.trim()) {
      alert("Class ID cannot be empty.");
      return;
    }
    try {
      const classRef = doc(db, "Classes", newClassId.trim());
      const classSnap = await getDoc(classRef);
      if (!classSnap.exists()) {
        alert(
          "No class found with that ID. Please check the ID and try again."
        );
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        Classes: arrayUnion(newClassId.trim()),
      });
      alert("Class added successfully!");
      setShowAddModal(false);
      setNewClassId("");
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Error adding class. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <LinearGradient
        colors={[
          "rgba(153, 0, 0, 0.8)", 
          "rgba(204, 0, 0, 0.8)", 
          "rgba(153, 0, 0, 0.8)",
        ]}
        className="w-full flex-1"
      >
        <Text className="mt-6 text-2xl font-extrabold text-white text-center">
          Manage Your Classes
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Sync Google Classroom"
            onPress={syncGoogleClassroom}
            className="mt-2 ml-4 mr-4"
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
          <Button
            title="Add Class Manually"
            onPress={addClassManually}
            className="ml-4 mr-4"
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </View>

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : classes.length === 0 ? (
          <Text className="mt-2 text-xl font-extrabold text-white text-center">
            No Classes Added
          </Text>
        ) : (
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

        {showAddModal && (
          <Modal visible={showAddModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text h4>Add New Class</Text>
                <TextInput
                  placeholder="Enter class ID"
                  value={newClassId}
                  onChangeText={setNewClassId}
                  style={styles.input}
                />
                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowAddModal(false)}
                    buttonStyle={styles.modalButton}
                    titleStyle={styles.buttonText}
                  />
                  <Button
                    title="Add"
                    onPress={handleAddClass}
                    buttonStyle={styles.modalButton}
                    titleStyle={styles.buttonText}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </LinearGradient>
      <HomeNavBar initialIndex={1} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  classItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 14,
    marginRight: 14,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  absences: {
    fontSize: 16,
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#f4511e",
    paddingHorizontal: 20,
  },
});
