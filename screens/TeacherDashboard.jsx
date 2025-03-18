// TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { Calendar } from 'react-native-calendars';
import * as DocumentPicker from 'expo-document-picker';
import HomeNavBar from '../components/HomeNavBar';
import { useNavigation } from '@react-navigation/native';

export default function TeacherDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [contentForDay, setContentForDay] = useState('');

  // NEW: state to store the selected file info
  const [selectedFile, setSelectedFile] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const q = query(
      collection(db, 'Classes'),
      where('teacherId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const classData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setClasses(classData);
        setLoadingClasses(false);
      }, 
      (error) => {
        console.error("Error fetching classes:", error);
        setLoadingClasses(false);
      }
    );
    return unsubscribe;
  }, [user.uid]);

  // Add a new class to Firestore
  const addClass = async () => {
    if (!newClassName.trim()) {
      Alert.alert("Error", "Class name cannot be empty.");
      return;
    }
    try {
      const randomId = String(Math.floor(Math.random() * 900) + 100);
      await setDoc(doc(db, 'Classes', randomId.toString()), {
        teacherId: user.uid,
        Name: newClassName.trim(),
        createdAt: new Date(),
        Id: randomId,
        Content: []
      });
      setNewClassName('');
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding class:", error);
      Alert.alert("Error", "Could not add class.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("LoginReCall");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Sign out failed.");
    }
  };

  // When a day is pressed, open the modal to add content for that day.
  const onDayPress = (day) => {
    if (selectedClass) {
      setSelectedDate(day.dateString);
      setShowContentModal(true);
    }
  };

  // Add content to the selected day by updating the class document.
  const addContentToDay = async () => {
    if (!contentForDay.trim()) {
      Alert.alert("Error", "Content cannot be empty.");
      return;
    }
    try {
      await updateDoc(doc(db, 'Classes', selectedClass.id), {
        Content: arrayUnion({
          Day: selectedDate,
          Material: contentForDay.trim(),
          createdAt: new Date(),
          // You could store a file URL/path here if you upload the file
        })
      });
      // CLEAR fields and modal
      setContentForDay('');
      setSelectedFile(null);
      setShowContentModal(false);
      Alert.alert("Success", "Content added successfully.");
    } catch (error) {
      console.error("Error adding content:", error);
      Alert.alert("Error", "Could not add content.");
    }
  };

  // NEW: handle file selection from user
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        type: '*/*' 
      });
      if (result.type === 'success') {
        // result.uri, result.name, result.size, etc.
        console.log('Picked file:', result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h3 style={styles.header}>Welcome {user?.displayName || ""}</Text>
      <Button 
        title="Add Class" 
        onPress={() => setShowAddModal(true)} 
        buttonStyle={styles.addButton} 
      />

      {loadingClasses ? (
        <Text>Loading classes...</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.classItem} 
              onPress={() => setSelectedClass(item)}
            >
              <Text style={styles.className}>{item.Name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No classes found.</Text>}
        />
      )}

      {selectedClass && (
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarHeader}>
            Calendar for {selectedClass.Name}
          </Text>
          <Button 
            title="Close Calendar" 
            onPress={() => setSelectedClass(null)} 
            buttonStyle={styles.closeCalendarButton} 
          />
          <Calendar
            hideExtraDays={false}
            firstDay={1}
            style={styles.calendar}
            onDayPress={onDayPress}
          />
        </View>
      )}

      {/* Modal to add a new class */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text h4>Add a New Class</Text>
            <TextInput
              placeholder="Enter class name"
              value={newClassName}
              onChangeText={setNewClassName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => setShowAddModal(false)} 
                buttonStyle={styles.modalButton} 
              />
              <Button 
                title="Add" 
                onPress={addClass} 
                buttonStyle={styles.modalButton} 
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal to add content (and optionally file) for a specific day */}
      <Modal visible={showContentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text h4>Add Content for {selectedDate}</Text>
            <TextInput
              placeholder="Enter content"
              value={contentForDay}
              onChangeText={setContentForDay}
              style={[styles.input, { height: 100 }]}
              multiline={true}
            />

            {/* NEW: Button to pick a file */}
            <Button
              title="Select File"
              onPress={pickFile}
              buttonStyle={[styles.modalButton, { marginTop: 10 }]}
            />

            {/* Display selected file name if any */}
            {selectedFile && (
              <Text style={{ marginTop: 10 }}>
                Selected File: {selectedFile.name}
              </Text>
            )}

            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => {
                  setShowContentModal(false);
                  setContentForDay("");
                  setSelectedFile(null);
                }} 
                buttonStyle={styles.modalButton} 
              />
              <Button 
                title="Save" 
                onPress={addContentToDay} 
                buttonStyle={styles.modalButton} 
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.signOutContainer}>
        <Button 
          title="Sign Out" 
          onPress={handleSignOut} 
          buttonStyle={styles.signOutButton} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  header: { 
    textAlign: "center", 
    marginBottom: 20 
  },
  addButton: { 
    backgroundColor: "#f4511e", 
    marginBottom: 20 
  },
  classItem: { 
    padding: 15, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 8, 
    marginBottom: 10 
  },
  className: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  calendarContainer: { 
    marginTop: 20, 
    borderTopWidth: 1, 
    borderColor: "#ccc", 
    paddingTop: 20 
  },
  calendarHeader: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  closeCalendarButton: { 
    backgroundColor: "#888", 
    marginTop: 10 
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 8, 
    width: "80%" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    padding: 10, 
    marginTop: 10 
  },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 20 
  },
  modalButton: { 
    backgroundColor: "#f4511e", 
    paddingHorizontal: 20 
  },
  signOutContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: "#d9534f",
    paddingHorizontal: 30,
  },
});
